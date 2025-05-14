from rest_framework import serializers
from .models import Farmer, Farm, DroneData, DroneStatus, UploadedImage, Weather, WeatherHistory
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ['id', 'name', 'phone', 'image', 'longitude', 'latitude']

class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ['id', 'name', 'crop_type', 'size_hectares', 'location']



class DroneStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DroneStatus
        fields = ['status', 'coordinates', 'image_url']

class DroneDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DroneData
        fields = ['coordinates', 'image_url', 'timestamp', 'analysis']


class FarmDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = ['id', 'name', 'crop_type', 'size_hectares', 'location']        

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }    

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'analysis', 'timestamp']
        read_only_fields = ['analysis', 'timestamp']

class Base64ImageListSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weather
        fields = '__all__'               

class WeatherHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherHistory
        fields = '__all__'              
        