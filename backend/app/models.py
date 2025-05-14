from django.db import models
from django.contrib.auth.models import User


# app/models.py

# Farmer model
def farmer_profile_upload_path(instance, filename):
    return f'profiles/{instance.user.username}/(filename)'
    

class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    name = models.CharField(default='name')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField()
    longitude = models.DecimalField(decimal_places=4, default=0.0000, max_digits=10)
    latitude = models.DecimalField(decimal_places=4, default=0.0000, max_digits=10)
    image = models.ImageField(upload_to=farmer_profile_upload_path, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'
       
    
# Farm Model

class Farm(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    size_hectares = models.DecimalField(max_digits=5, decimal_places=2)
    crop_type = models.CharField(max_length=100)


    def __str__(self):
        return self.name 

# Weather Model

class Weather(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='current_weather')
    temperature = models.FloatField()
    humidity = models.FloatField()
    weather = models.CharField(max_length=255)
    season = models.CharField(max_length=50)
    forecast = models.JSONField()  # 3-day forecast or similar
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Weather for {self.farmer.user.username} at {self.timestamp}"

class WeatherHistory(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name='weather_history')
    temperature = models.FloatField()
    humidity = models.FloatField()
    weather = models.CharField(max_length=255)
    season = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for {self.farmer.user.username} at {self.timestamp}"

# Drone Flight Model
    
class DroneStatus(models.Model):
    STATUS_CHOICES = (
        ('idle', 'idle'),
        ('flying', 'Flying'),
        ('completed', 'Completed')
    )
    farmer = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='idle')
    coordinates = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class DroneData(models.Model):
    farmer = models.CharField(max_length=100)
    coordinates = models.CharField(max_length=100)
    image_url = models.URLField()
    timestamp = models.DateTimeField(auto_now_add=True)
    analysis = models.TextField(blank=True)

class UploadedImage(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/')
    analysis = models.TextField(blank=True, null=True)  # This remains blank until analyzed
    timestamp = models.DateTimeField(auto_now_add=True)

