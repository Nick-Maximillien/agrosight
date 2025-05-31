# app/utils.py

import openai
import base64
from django.conf import settings
import requests
import os
import tempfile





def fetch_weather(lat, lon):
    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'
    response = requests.get(url)

    if response.status_code != 200:
        raise Exception("Weather fetch failed")

    data = response.json()
    return {
        'temperature': data['main']['temp'],
        'humidity': data['main']['humidity'],
        'weather': data['weather'][0]['description'],
        'forecast': data,  # Store entire response if needed
        'season': get_season(),
    }

def get_season():
    from datetime import datetime
    month = datetime.now().month
    if month in [12, 1, 2]:
        return 'Winter'
    elif month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    else:
        return 'Autumn'

         

