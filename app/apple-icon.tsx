import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: '#16332B',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2FD9C4',
          borderRadius: '25%',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 'bold',
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  )
}