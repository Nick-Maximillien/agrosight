'use client'
import { useAuth } from 'context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from 'lib/api';



interface Farm {
  id: number;
  name: string;
  location: string;
  size_hectares: number;
}

export default function Farms() {
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

    if (loading) return <p>Loading...</p>;

    return (
        <div>
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
    );
}