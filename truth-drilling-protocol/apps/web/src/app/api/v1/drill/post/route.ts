import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis from Env
const redis = Redis.fromEnv();

export async function POST(req: Request) {
  try {
    // 1. Verify API Key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey || !apiKey.startsWith("sk_drill_")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing or Invalid API Key" }, { status: 401 });
    }

    const { debateId, content, side } = await req.json();

    if (!debateId || !content || !side) {
      return NextResponse.json({ success: false, error: "Missing required fields: debateId, content, side" }, { status: 400 });
    }

    const payload = {
      debateId,
      content,
      side,
      timestamp: new Date().toISOString(),
      agentId: apiKey.substring(0, 15) + "..." // Obfuscate key in public log
    };

    // 2. STORE IN REDIS (List: "latest_drills")
    // LPUSH adds to the head of the list
    await redis.lpush("latest_drills", JSON.stringify(payload));
    
    // Trim list to keep only last 50 items to save space
    await redis.ltrim("latest_drills", 0, 49);

    console.log(`[DRILL] Saved to Redis: ${content}`);

    // 3. Return Success
    return NextResponse.json({ 
      success: true, 
      message: "Argument Drilled & Indexed Successfully",
      data: {
        ...payload,
        txHash: "0xPENDING_CONSENSUS_VERIFICATION" 
      }
    });

  } catch (error) {
    console.error("Redis Error:", error);
    return NextResponse.json({ success: false, error: "Internal Protocol Error" }, { status: 500 });
  }
}
