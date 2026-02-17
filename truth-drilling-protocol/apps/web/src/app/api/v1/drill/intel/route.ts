import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis from Env
const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic'; // Disable caching for live data

export async function GET() {
  try {
    // Fetch last 20 drills
    const drills = await redis.lrange("latest_drills", 0, 19);
    
    // Parse JSON strings back to objects
    const data = drills.map((item: string) => JSON.parse(item));

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      data: data 
    });
  } catch (error) {
    console.error("Redis Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch void intel" }, { status: 500 });
  }
}
