from rest_framework import viewsets, status, generics
import base64
import io
import requests
from PIL import Image
import numpy as np
import io
from django.core.files.storage import FileSystemStorage
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import ( Farmer, 
                     Farm, DroneData, DroneStatus,
                      Weather, WeatherHistory, Diagnosis )
from .serializers import ( FarmerSerializer, FarmSerializer,
                           DroneDataSerializer, SignupSerializer,
                             FarmDetailSerializer, DroneStatusSerializer,
                              WeatherSerializer, WeatherHistorySerializer, DiagnosisSerializer )
from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
import torch
from io import BytesIO
from datetime import datetime
import random
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .utils import fetch_weather
from django.contrib.auth.models import User

# Create your views here.

class FarmerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _= Farmer.objects.get_or_create(user=request.user)
        serializer = FarmerSerializer(profile)
        return Response(serializer.data)
    def post(self, request):
        profile, _= Farmer.objects.get_or_create(user=request.user)
        serializer = FarmerSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class FarmViewSet(viewsets.ModelViewSet):
    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
           


class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Farmer.objects.create(user=user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Signup successful.',
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class CreateFarmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FarmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        farms = Farm.objects.filter(user=request.user)
        serializer = FarmDetailSerializer(farms, many=True)
        return Response(serializer.data)           

class DroneFlightList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_farms = Farm.objects.filter(user=request.user)
        flights = DroneData.objects.filter(farm__in=user_farms)
        serializer = DroneDataSerializer(flights, many=True)
        return Response(serializer.data)
    
class DeployDroneView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        status, created = DroneStatus.objects.get_or_create(farmer=user)
        status.status = 'flying'
        status.coordinates = '0.0000, 0.0000'
        status.image_url = ''
        status.save()
        return Response({'message': 'Drone Deployed'})

class DroneStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        status, created = DroneStatus.objects.get_or_create(farmer=user)

        if status.status == 'flying':
            lat = round(random.uniform(-1.0, 1.0), 4)
            lng = round(random.uniform(36.0, 37.0), 4)
            status.coordinates = f"{lat}, {lng}"
            status.image_url = 'https://picsum.photos/300/200'
            status.save()

        serializer = DroneStatusSerializer(status)
        return Response(serializer.data)

class StopDroneView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        try:
            status = DroneStatus.objects.get(farmer = user)
        except DroneStatus.DoesNotExist:
            return Response({'error': 'Drone was not deployed'}, status=400)

        if status.status != 'flying':
            return Response({'error': 'Drone is not currently flying'}, status=400)

        # Store the final data
        DroneData.objects.create(
            farmer=user,
            coordinates=status.coordinates,
            image_url=status.image_url,
        )

        # Update drone status
        status.status = 'completed'
        status.save()

        return Response({'message': 'Drone scan ended and data stored'})

class DroneDataListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = DroneData.objects.filter(farmer=user).order_by('-timestamp')
        serializer = DroneDataSerializer(data, many=True)
        return Response(serializer.data)




class CreateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, _= Farmer.objects.get_or_create(user=request.user)
        profile.phone = request.data.get('phone', profile.phone)
        if 'image' in request.FILES:
            profile.image = request.FILES['image']
        profile.save()
        return Response({'detail': 'Profile updated'}, status=201)

class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Farmer.objects.get(user=request.user)
        data = {
            'name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
            'phone': profile.phone,
            'image': profile.image.url if profile.image else '',
        }
        return Response(data)                
       

class WeatherAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            farmer = user.farmer_profile
        except Farmer.DoesNotExist:
            return Response({'error': 'Farmer profile not found'}, status=404)

        weather_data = fetch_weather(farmer.latitude, farmer.longitude)

        weather = Weather.objects.create(
            farmer=farmer,
            temperature=weather_data['temperature'],
            humidity=weather_data['humidity'],
            weather=weather_data['weather'],
            forecast=weather_data['forecast'],
            season=weather_data['season'],
        )

        # Save to history
        WeatherHistory.objects.create(
            farmer=farmer,
            temperature=weather.temperature,
            humidity=weather.humidity,
            weather=weather.weather,
            season=weather.season,
        )

        serializer = WeatherSerializer(weather)
        return Response(serializer.data)

class WeatherHistoryAPIView(generics.ListAPIView):
    serializer_class = WeatherHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return WeatherHistory.objects.filter(farmer__user=user).order_by('-timestamp')       



class DiagnosisCreateView(generics.CreateAPIView):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer
    permission_classes = [AllowAny]  # Required to allow WhatsApp unauthenticated POSTs

    def create(self, request, *args, **kwargs):
        user = request.user if request.user.is_authenticated else None

        if user:
            # 🎯 Web user (authenticated)
            farmer, _ = Farmer.objects.get_or_create(
                user=user,
                defaults={"phone": "", "name": user.username}
            )
            phone = farmer.phone
            name = farmer.name
        else:
            # 📱 WhatsApp user (unauthenticated)
            phone = request.data.get("phone_number", "").replace("whatsapp:", "").strip()
            name = request.data.get("profile_name", "Unknown").strip()

            farmer = Farmer.objects.filter(phone=phone).first()

            if not farmer:
                username = f"user_{phone.replace('+', '')}"
                user = User.objects.filter(username=username).first()
                if not user:
                    user = User.objects.create(username=username)
                    print(f"✅ Created new user: {username}")

                farmer = Farmer.objects.create(user=user, phone=phone, name=name)
                print(f"✅ Created new farmer with phone: {phone}, name: {name}, user: {user.username}")

        # Prepare data for Diagnosis instance
        data = {
            "farmer": farmer.id,
            "phone_number": phone,
            "image_name": request.data.get("image_name"),
            "raw_result": request.data.get("raw_result"),
            "insight": request.data.get("insight"),
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
