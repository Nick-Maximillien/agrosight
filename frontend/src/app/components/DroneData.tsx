'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "context/AuthContext"

interface DroneData {
    timestamp: string;
    coordinates: string;
    image_url: string;
    analysis: string;
}

export default function DroneData() {
    const { token } = useAuth();
    const [data, setData] = useState<DroneData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/drone-data/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data)
                setError(null);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    setError('Unauthorised. Please login again.');
                    clearInterval(interval);
                } else {
                    console.error('Fetch error:', err);
                }
            }
        };
        const interval = setInterval(fetchData, 1000000);
        fetchData();
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div>
            <h2>Drone Data Feed</h2>
            {data.length == 0 ? (
                <p>No data yet..</p>
            ) : (
                data.map((entry, index) => (
                    <div key={index}>
                        <p><b>Time:</b>{new Date(entry.timestamp).toLocaleString()}</p>
                        <p><b>GPS Coordinates:</b>{entry.coordinates}</p>
                        <img src={entry.image_url} alt="Drone Capture" />
                        <p><b>Analysis:</b>{entry.analysis}</p>
                    </div>
                ))
            )}
        </div>
    );
}