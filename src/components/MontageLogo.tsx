import React from 'react'

interface MontageLogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export const MontageLogo: React.FC<MontageLogoProps> = ({
  size = 36,
  showText = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* ── Bespoke SVG Emblem ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="montageGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1ED760" />
            <stop offset="100%" stopColor="#1DB954" />
          </linearGradient>
          <filter id="montageGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1DB954" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Circular Obsidian Background Plate */}
        <circle cx="24" cy="24" r="23" fill="#121212" stroke="#242424" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="21" fill="#181818" />

        {/* Stylized M-Soundwave Bars */}
        <g filter="url(#montageGlow)">
          {/* Bar 1 (Left Leg) */}
          <rect x="11" y="16" width="4" height="16" rx="2" fill="url(#montageGreenGrad)" />
          {/* Bar 2 (Mid-Left Slope) */}
          <rect x="17.5" y="22" width="4" height="12" rx="2" fill="url(#montageGreenGrad)" />
          {/* Bar 3 (Center Peak Pulse) */}
          <rect x="24" y="13" width="4" height="22" rx="2" fill="#FFFFFF" />
          {/* Bar 4 (Mid-Right Slope) */}
          <rect x="30.5" y="22" width="4" height="12" rx="2" fill="url(#montageGreenGrad)" />
          {/* Bar 5 (Right Leg) */}
          <rect x="37" y="16" width="4" height="16" rx="2" fill="url(#montageGreenGrad)" />
        </g>
      </svg>

      {/* ── Brand Typography Lockup ── */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-extrabold tracking-tight text-lg leading-none font-sans">
              MONTAGE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1db954]" />
          </div>
          <span className="text-[10px] font-bold text-[#1db954] tracking-[0.2em] uppercase mt-0.5 font-mono">
            STUDIO
          </span>
        </div>
      )}
    </div>
  )
}
