'use client'
import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import axios from "axios";

interface UploadItem {
    id: number;
    image: string;
    analysis: string;
    timestamp: string;
}

export default function UploadHistory() {
    const { token } = useAuth();
    const [history, setHistory] = useState<UploadItem[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/upload-images/history/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHistory(res.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        if (token) fetchHistory();
    }, [token]);

    return (
        <div>
            <h2>Your Upload History</h2>
            <ul>
                {history.map((item) => (
                    <li key={item.id}>
                        <img src={item.image} alt="uploaded" width={150} />
                        <p><b className="analyses">Analysis:</b> {item.analysis}</p>
                        <h3><b>{new Date(item.timestamp).toLocaleString()}</b></h3>
                    </li>
                ))}
            </ul>
        </div>
    )
}