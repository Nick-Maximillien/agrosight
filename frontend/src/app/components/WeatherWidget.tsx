'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "context/AuthContext";

interface ForecastDay {
  dt: number;
  temp: { day: number };
  weather: { description: string }[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  weather: string;
  season: string;
  forecast: ForecastDay[];
}

const WeatherWidget = () => {
  const { token } = useAuth()
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:8000/weather/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setWeather(res.data))
      .catch((err) => console.error('Failed to fetch weather:', err));
  }, [token]);
  
  return (
    <div>
      <h2>Current Weather</h2>
      {weather ? (
        <div>
             <p><b>Condition:</b> {weather.weather}</p>
             <p><b>Temperature:</b> {weather.temperature}°C</p>
             <p><b>Humidity:</b> {weather.humidity}%</p>
             <p><b>Season:</b> {weather.season}</p>
             <h3>7-Day Forecast:</h3>
             <ul>
              {weather.forecast.map((day, i) => (
                <li key={i}>
                  {new Date(day.dt * 1000).toDateString()}: {day.temp.day}°C, {day.weather[0].description}
                </li>
              ))}
             </ul>
        </div>
        ) : (
             <p>Loading weather...</p>
        )}
        <Link href="/weather_history">
        <button className="dashboardBtns">View Weather Records</button>
        </Link>
       </div>
    );
}

export default WeatherWidget;