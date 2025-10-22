import Image from "next/image";
import { Search, Play, Zap } from "lucide-react";

export default function Hero() {
  return (
    // Full-bleed hero with minimal side gaps, no top gap, image moved up to hide top border radius
    <section className="relative w-full overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden -mt-8"
          style={{
            height: '100vh',
            borderBottomRightRadius: '86px',
            borderBottomLeftRadius: '86px'
          }}
        >
          <Image
            src="/images/balloon4to.png"
            alt="Hot air balloons over landscape"
            fill
            className="object-cover object-center"
            priority
          />

          {/* subtle darkening bottom to top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />

          {/* Centered headline + search */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 
              className="max-w-6xl text-white text-center drop-shadow-md"
              style={{
                fontFamily: 'var(--font-roboto)',
                fontWeight: 600,
                fontSize: '74px',
                lineHeight: '74px',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              Beyond the Horizon Stories<br className="hidden sm:block"/> That Move You
            </h1>

            {/* Glass search bar */}
            <div className="mt-6 sm:mt-8 w-full flex justify-center relative">
              <div style={{
                width: '518px',
                height: '60px',
                opacity: 1,
                borderRadius: '14px',
                paddingTop: '16px',
                paddingRight: '24px',
                paddingBottom: '16px',
                paddingLeft: '24px',
                gap: '10px',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search className="h-5 w-5 text-white/80" style={{ marginRight: '10px' }} />
                <input
                  type="text"
                  placeholder="Search Blog Post"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '16px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom-right circular controls */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-3 sm:gap-4">
            <button
              style={{
                width: '54.44px',
                height: '54.44px',
                opacity: 1,
                borderRadius: '31.19px',
                paddingTop: '13.61px',
                paddingRight: '14.18px',
                paddingBottom: '13.61px',
                paddingLeft: '14.18px',
                gap: '5.67px',
                borderWidth: '0.57px',
                borderColor: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              aria-label="Play"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              style={{
                width: '54.44px',
                height: '54.44px',
                opacity: 1,
                borderRadius: '31.19px',
                paddingTop: '13.61px',
                paddingRight: '14.18px',
                paddingBottom: '13.61px',
                paddingLeft: '14.18px',
                gap: '5.67px',
                borderWidth: '0.57px',
                borderColor: 'rgba(255,255,255,0.35)',
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(12px)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.25)';
              }}
              aria-label="Boost"
            >
              <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}