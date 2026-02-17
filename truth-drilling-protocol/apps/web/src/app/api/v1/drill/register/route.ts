import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { address, signature } = await req.json();
    
    // In a production environment, you would verify the signature here
    // and store the agent in a database.
    
    return NextResponse.json({ 
      success: true, 
      message: "Agent registered on the Truth Drilling substrate.",
      agent: address 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
