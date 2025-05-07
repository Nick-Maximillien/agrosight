'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "context/AuthContext";

export default function FarmerProfile () {
    const { token } = useAuth();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8000/farmer/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, [token]);
    if (!profile) return <p>Loading profile...</p>;

    return (
        <div>
            <h2>Farmer Profile</h2>
            <img className="profilePic" src={`http://localhost:8000${profile.image}`} alt="profile" width={150} />
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Phone:</b> {profile.phone}</p>
        </div>
    );
}