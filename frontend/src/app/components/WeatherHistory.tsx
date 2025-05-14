'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';  // Import the Auth context

interface WeatherHistoryItem {
  temperature: number;
  humidity: number;
  weather: string;
  season: string;
  timestamp: string;
}

export default function WeatherHistory() {
  const { token } = useAuth();  // Retrieve the token from the context
  const [history, setHistory] = useState<WeatherHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios
        .get('/api/weather/history', {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach the token here
          },
        })
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch weather history:", err);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="mt-6 p-4 bg-white border rounded-lg">
      <h2 className="text-lg font-bold mb-4">Weather History</h2>
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li key={index} className="text-sm border-b pb-2">
            <strong>{new Date(item.timestamp).toLocaleString()}</strong>: {item.weather}, {item.temperature}°C, {item.humidity}% Humidity
          </li>
        ))}
      </ul>
    </div>
  );
}
