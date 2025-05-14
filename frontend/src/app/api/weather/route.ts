import { NextResponse } from 'next/server';
import axios from 'axios';

const WEATHER_API_URL = 'http://localhost:8000/weather/'; // Update to match your Django backend endpoint

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(WEATHER_API_URL, {
      headers: {
        Authorization: authHeader,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
