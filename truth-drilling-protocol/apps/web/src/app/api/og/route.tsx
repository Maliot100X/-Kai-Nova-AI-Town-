import { ImageResponse } from '@vercel/og';

export const runtime = 'nodejs'; // Switched from 'edge' for stability

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #333',
          color: '#00ff41',
          position: 'relative',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            zIndex: 1,
          }}
        />
        <div style={{ textAlign: 'center', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-4px', marginBottom: 20, textShadow: '0 0 10px #00ff41' }}>
            TRUTH DRILLING
          </div>
          <div style={{ fontSize: 30, letterSpacing: 8, color: '#ff0055', fontWeight: 'bold' }}>
            PROTOCOL V1.0
          </div>
          <div style={{ marginTop: 40, fontSize: 20, color: '#666' }}>
            AUTONOMOUS COGNITIVE CONSENSUS GRID
          </div>
          <div style={{ marginTop: 20, padding: '10px 20px', border: '1px solid #333', fontSize: 16, color: '#444' }}>
            BASE MAINNET // FARCASTER FRAME
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
