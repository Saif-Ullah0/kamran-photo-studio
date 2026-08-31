"use client";

interface StaticCameraModelProps {
  className?: string;
}

export default function StaticCameraModel({ className = "" }: StaticCameraModelProps) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 300 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[260px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Metallic Top Plate Gradient */}
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Leather Body Gradient */}
          <linearGradient id="leatherGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c5332" />
            <stop offset="100%" stopColor="#5c341d" />
          </linearGradient>

          {/* Dark Grip Panel */}
          <linearGradient id="gripGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#52311c" />
            <stop offset="100%" stopColor="#361f11" />
          </linearGradient>

          {/* Lens Barrel Metal */}
          <linearGradient id="metalBarrel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="25%" stopColor="#27272a" />
            <stop offset="50%" stopColor="#3f3f46" />
            <stop offset="75%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          {/* Gold Accent Ring */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Lens Glass Reflection */}
          <radialGradient id="glassReflection" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#09090b" stopOpacity="0.95" />
          </radialGradient>

          {/* Soft Shadow */}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5" />
          </filter>
        </defs>

        {/* ── CAMERA BODY ── */}
        {/* Leather Main Body */}
        <rect x="50" y="80" width="200" height="110" rx="12" fill="url(#leatherGradient)" />
        {/* Leather Grip Texture */}
        <rect x="195" y="82" width="45" height="106" rx="4" fill="url(#gripGradient)" />

        {/* Chrome Top Plate */}
        <rect x="48" y="60" width="204" height="25" rx="5" fill="url(#chromeGradient)" />
        {/* Viewfinder Hump */}
        <rect x="125" y="42" width="50" height="22" rx="4" fill="url(#chromeGradient)" />

        {/* Gold Shutter Button */}
        <rect x="210" y="48" width="16" height="12" rx="2" fill="url(#goldGradient)" />

        {/* Film Advance Lever */}
        <rect x="68" y="52" width="28" height="8" rx="2" fill="url(#chromeGradient)" />

        {/* Red Tally Light */}
        <circle cx="95" cy="100" r="4" fill="#ef4444" />
        <circle cx="95" cy="100" r="2" fill="#fca5a5" />

        {/* Strap Lugs */}
        <rect x="42" y="105" width="8" height="14" rx="2" fill="url(#chromeGradient)" />
        <rect x="250" y="105" width="8" height="14" rx="2" fill="url(#chromeGradient)" />

        {/* ── LENS ASSEMBLY (Tapered & Centered) ── */}
        {/* Outer Rear Mount Base */}
        <circle cx="150" cy="135" r="54" fill="#27272a" stroke="#52525b" strokeWidth="2" />

        {/* Main Barrel with Ridges */}
        <circle cx="150" cy="135" r="48" fill="url(#metalBarrel)" />
        <circle cx="150" cy="135" r="46" fill="none" stroke="#09090b" strokeWidth="2" strokeDasharray="4 2" />

        {/* Gold Brass Ring */}
        <circle cx="150" cy="135" r="42" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />

        {/* Tapered Front Cone Ring */}
        <circle cx="150" cy="135" r="38" fill="url(#metalBarrel)" />

        {/* Aperture Blades Ring (Inner Bezel) */}
        <circle cx="150" cy="135" r="32" fill="#09090b" />

        {/* Front Glass Element */}
        <circle cx="150" cy="135" r="28" fill="url(#glassReflection)" />

        {/* Lens Glint / Flare Highlight */}
        <ellipse cx="140" cy="125" rx="12" ry="6" fill="#ffffff" fillOpacity="0.25" transform="rotate(-30 140 125)" />
      </svg>
    </div>
  );
}