import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CARONEX — Fahrzeugwissen und Fahrzeugverkauf';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#08090a',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '4px',
              backgroundColor: '#ff3355',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-2px',
            }}
          >
            CARONEX
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#9ca3af',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Fahrzeugwissen und Fahrzeugverkauf
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
