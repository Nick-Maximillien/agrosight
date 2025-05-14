'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import Link from 'next/link';
import { href } from 'react-router-dom';

interface WeatherData {
  temperature: number;
  humidity: number;
  weather: string;
  season: string;
  forecast: any; // You can strongly type this if you know the structure
  timestamp: string;
}

export default function WeatherWidget() {
  const { token } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    axios
      .get('/api/weather', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWeather(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch weather:', err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading weather...</div>;
  if (!weather) return <div>No weather data available</div>;

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
      <p><strong>Temperature:</strong> {weather.temperature}°C</p>
      <p><strong>Humidity:</strong> {weather.humidity}%</p>
      <p><strong>Condition:</strong> {weather.weather}</p>
      <p><strong>Season:</strong> {weather.season}</p>
      <p><strong>Updated:</strong> {new Date(weather.timestamp).toLocaleString()}</p>
    </div>
  );
}
