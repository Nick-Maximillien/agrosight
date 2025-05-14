'use client'

import { useEffect, useState } from 'react';
import FarmForm from 'app/components/FarmForm';
import { useAuth } from 'context/AuthContext';
import DroneFeed from 'app/components/DroneFeed';
import OrderDroneButton from 'app/components/OrderDroneButton';
import StopDrone from 'app/components/StopDroneButton';
import DroneData from 'app/components/DroneData';
import UploadImages from 'app/components/UploadImages';
import FarmerProfile from 'app/components/FarmerProfile';
import CreateProfileToggle from 'app/components/CreateProfileToggle';
import WeatherWidget from 'app/components/WeatherWidget';
import Link from 'next/link';
import Farms from 'app/components/Farms';

export default function Dashboard() {
  const { token } = useAuth();


  if (!token) return <p>Please login to view your dashboard.</p>;

  return (
    <div>
      <h1>Farmer Dashboard</h1>
      <div className='farmerProfile'><FarmerProfile /></div>
      <div className='weatherWidget'><WeatherWidget /></div>
      <div className='createProfileToggle'><CreateProfileToggle /></div>
      <div className='createFarm'>
      <Farms />
      </div>
      <div className='farmForm'>
      <FarmForm />
      </div>
      <div className='togglesA'><OrderDroneButton token={token} /></div>
      <div className='togglesB'><StopDrone /></div>
      <div className='togglesC'><Link className='toggleC' href="/uploads"><button className='toggleC'>View your Previous Uploads</button></Link>
      </div>
      <Link href="/weather_history"><button>View Weather Records</button></Link>
      <div className='uploadImage'>
        <UploadImages />
      </div>
      <DroneData />
    </div>
  );
}
