'use client'
import axios from "axios"
import { useAuth } from "context/AuthContext"
import { headers } from "next/headers";
import { useState } from "react"

export default function StopDrone() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    
    const handleStopDrone = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/stop-drone/', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResponse(res.data.detail || 'Drone scan stopped and data stored.');
        } catch (err) {
            console.error('Error stopping drone scan', err);
            setResponse('Failed to stop drone..');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button 
               onClick={handleStopDrone}
               disabled={loading}
            >
                {loading ? 'Stopping Drone...' : 'Stop Drone & Store Data'}
            </button>
            {response && <p>{response}</p>}
        </div>
    );
}