'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "context/AuthContext";

interface WeatherRecord {
    temperature: number;
    humidity: number;
    weather: string;
    season: string;
    timestamp: string;
}

const WeatherRecord = () => {
    const { token } = useAuth();
    const [history, setHistory] = useState<WeatherRecord[]>([]);

    useEffect(() => {
        if (!token) return;

        axios
          .get('http:localhost:8000/weather/history/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setHistory(res.data))
          .catch((err) => console.error('Failed to fetch weather history:', err));
    }, [token]);

    return (
        <div>
            <h2>Weather History</h2>
            {history.length ? (
                <ul>
                    {history.map((record, i) => (
                        <li key={i}>
                            <p>{new Date(record.timestamp).toLocaleString()}</p>
                            <p><b>Condition:</b> {record.weather}</p>
                            <p><b>Temperature:</b> {record.temperature}°C</p>
                            <p><b>Humidity:</b> {record.humidity}%</p>
                            <p><b>Season:</b> {record.season}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Weather history yet.</p>
            )}
        </div>
    );
}

export default WeatherRecord;
