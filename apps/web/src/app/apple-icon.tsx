import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#08090a',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '3px',
              backgroundColor: '#ff3355',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            CX
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
