import { NextResponse } from 'next/server';
import axios from 'axios';
import { getTokenFromLocalStorage } from '@utils/getTokenFromLocalStorage'; // Utility to fetch token from localStorage

const WEATHER_HISTORY_API_URL = 'http://localhost:8000/weather/history/';  // Replace with your actual Django backend URL if different

export async function GET(request: Request) {
  try {
    const token = getTokenFromLocalStorage();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make a request to the Django backend's weather history endpoint
    const response = await axios.get(WEATHER_HISTORY_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,  // Send the token in the Authorization header
      },
    });

    // Return the weather history data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching weather history:', error);
    return NextResponse.json({ error: 'Failed to fetch weather history' }, { status: 500 });
  }
}
