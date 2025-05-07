'use client';
import React, { useState } from 'react';
import { useAuth } from 'context/AuthContext';

interface FarmFormData {
  name: string;
  crop_type: string;
  size_hectares: number;
  location: string;
}

export default function FarmForm() {
  const [formData, setFormData] = useState<FarmFormData>({
    name: '',
    crop_type: '',
    size_hectares: 0,
    location: '',
  });

  const [message, setMessage] = useState('');
  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'size_hectares' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/create-farm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setMessage('Farm created successfully!');
      setFormData({ name: '', crop_type: '', size_hectares: 0, location: '' });
    } else {
      setMessage('Error creating farm');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Farm</h2>
      <p>Farm Name:</p>
      <input
        name="name"
        className="formInput"
        placeholder="Farm Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <p>Crop Type:</p>
      <input
        name="crop_type"
        className="formInput"
        placeholder="Crop Type"
        value={formData.crop_type}
        onChange={handleChange}
        required
      />
      <p>Size in Hectares:</p>
      <input
        name="size_hectares"
        className="formInput"
        type="number"
        placeholder="Size (in Hectares)"
        value={formData.size_hectares}
        onChange={handleChange}
        required
      />
      <p>Location:</p>
      <input
        name="location"
        className="formInput"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      /> <br />
      <button className='createFarmBtn' type="submit">Create your Farm</button>
      <p>{message}</p>
    </form>
  );
}
