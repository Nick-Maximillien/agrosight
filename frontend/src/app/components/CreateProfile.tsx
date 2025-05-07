'use client'
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "context/AuthContext";

export default function CreateProfile() {
    const { token } = useAuth();
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const formData = new FormData()
        formData.append('phone', phone);
        if (image) formData.append('image', image);

        try {
            axios.post('http://localhost:8000/create-profile/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Profile created successfully');
        } catch (err) {
            console.error('Failed to create profile:', err);
            setMessage('Failed to create profile')
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
              type="text"
              className="formInput"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} 
            />
            <input
              type="file"
              className="formInput"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
             />
             <button type="submit">Create Profile</button>
             <p>{message}</p>
        </form>
    );
}