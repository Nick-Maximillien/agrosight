'use client'

import { useEffect, useState } from 'react';
import { fetchWithAuth } from 'lib/api';
import FarmForm from 'app/components/FarmForm';
import { useAuth } from 'context/AuthContext';
import DroneFeed from 'app/components/DroneFeed';
import OrderDroneButton from 'app/components/OrderDroneButton';
import StopDrone from 'app/components/StopDroneButton';
import DroneData from 'app/components/DroneData';
import UploadImage from 'app/components/UploadImage';
import FarmerProfile from 'app/components/FarmerProfile';
import CreateProfileToggle from 'app/components/CreateProfileToggle';
import WeatherWidget from 'app/components/WeatherWidget';
import Link from 'next/link';

interface Farm {
  id: number;
  name: string;
  location: string;
  size_hectares: number;
}

export default function Dashboard() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const farmsRes = await fetchWithAuth('http://localhost:8000/dashboard/', token);

        if (!farmsRes.ok) throw new Error('Failed to fetch');

        const farmsData = await farmsRes.json();

        // Handle error in farmsData
        if (farmsData.error) {
          console.error(farmsData.error);
          return;
        }

        setFarms(farmsData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (!token) return <p>Please login to view your dashboard.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      <div className='farmerProfile'><FarmerProfile /></div>
      <div className='weatherWidget'><WeatherWidget /></div>
      <div className='createProfileToggle'><CreateProfileToggle /></div>
      <div className='createFarm'>
      <h2>Your Farms</h2>
      {farms.length === 0 ? (
        <p>No farms created yet.</p>
      ) : (
        farms.map((farm) => (
          <div key={farm.id}>
            <h4><b>Farm: {farm.name} Farm</b></h4>
            <p>Name: {farm.name}</p>
            <p>Location: {farm.location}</p>
            <p>Size: {farm.size_hectares} hectares</p>
          </div>
        ))
      )}
      </div>
      <div className='farmForm'>
      <FarmForm />
      </div>
      <div className='togglesA'><OrderDroneButton token={token} /></div>
      <div className='togglesB'><StopDrone /></div>
      <div className='togglesC'><Link className='toggleC' href="/uploads"><button className='toggleC'>View your Previous Uploads</button></Link>
      </div>
      <div className='uploadImage'>
        <UploadImage />
      </div>
      <DroneData />
    </div>
  );
}
