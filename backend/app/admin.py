from django.contrib import admin
from .models import Farmer, Farm, Weather, WeatherHistory, DroneStatus, DroneData, UploadedImage

# Register your models here.

admin.site.register(Farmer)
admin.site.register(Farm)
admin.site.register(Weather)
admin.site.register(WeatherHistory)
admin.site.register(DroneStatus)
admin.site.register(DroneData)
admin.site.register(UploadedImage)

