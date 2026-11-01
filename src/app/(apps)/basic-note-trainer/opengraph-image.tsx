import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Basic Note Trainer | Guitar Companion';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            🎵
          </div>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#f8fafc' }}>
            Guitar Companion
          </span>
        </div>

        <h1
          style={{
            fontSize: '64px',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            textAlign: 'center',
            margin: '0 0 16px 0',
            background: 'linear-gradient(90deg, #ffffff 0%, #fbbf24 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Basic Note Trainer
        </h1>

        <p
          style={{
            fontSize: '26px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '850px',
            margin: 0,
          }}
        >
          Master Anglo-Saxon (A-G) and European Solfège (Do-Si) translations, chromatic accidentals, and natural semitones.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '44px',
          }}
        >
          {[
            { note: 'A', solfege: 'La' },
            { note: 'C', solfege: 'Do' },
            { note: 'E - F', solfege: 'Mi - Fa' },
            { note: 'B - C', solfege: 'Si - Do' },
          ].map((pair, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '16px',
                background: '#18181b',
                border: '2px solid #3f3f46',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
              }}
            >
              <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#f59e0b' }}>
                {pair.note}
              </span>
              <span style={{ fontSize: '18px', color: '#71717a' }}>
                {pair.solfege}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
