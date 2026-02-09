import { ImageResponse } from 'next/og'

// Route segment config for static export
export const runtime = 'nodejs'
export const dynamic = 'force-static'

// Image metadata
export const alt = 'ael | Web3 Developer Portfolio'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#0c0c0c',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Grid Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                    }}
                />

                {/* Central Glow */}
                <div
                    style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                    }}
                />

                {/* Text Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: 100, color: '#fafafa', fontWeight: 700, letterSpacing: '-0.05em' }}>
                            ael
                        </span>
                        <span style={{ fontSize: 100, color: '#444444', fontWeight: 300, marginLeft: '16px' }}>
                            /
                        </span>
                        <span style={{ fontSize: 100, color: '#888888', fontWeight: 300, letterSpacing: '-0.05em', marginLeft: '16px' }}>
                            orbital
                        </span>
                    </div>

                    <div style={{
                        fontSize: 24,
                        color: '#666666',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '12px 24px',
                        borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        Web3 & Blockchain Engineer
                    </div>
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
