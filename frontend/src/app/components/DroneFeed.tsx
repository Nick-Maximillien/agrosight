'use client'
import { useEffect, useState } from "react"

export default function DroneFeed({ token }: { token: string }) {
    const [droneData, setDroneData] = useState<any>(null);

    const fetchDroneData = async () => {
        try {
            const res = await fetch('http://localhost:8000/drone-status/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setDroneData(data);
            }
        } catch (err) {
            console.log('Error fetching drone data:', err);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchDroneData, 2000); // poll data every 2 seconds
        fetchDroneData(); // initial fetch
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Active Drone Status</h1>
            {droneData ? (
                <div>
                    <h3>Status: {droneData.status}</h3>
                    <h4>Coordinates: {droneData.coordinates}</h4>
                    {droneData.image_url && <img src={droneData.image_url} width={300} alt="drone_stream" />}
                </div>
            ) : (
                <p>No data yet..</p>
            )}
        </div>
    );
}