import React from 'react';

interface IslamicLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export function IslamicLogo({ className = '', size = 'md' }: IslamicLogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 md:w-20 md:h-20',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    xl: 'w-32 h-32 md:w-36 md:h-36',
    custom: '',
  };

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${sizeClasses[size]} ${className} select-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Premium Metallic Gold Gradient */}
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" /> {/* light luster */}
          <stop offset="20%" stopColor="#FBBF24" /> {/* amber 400 */}
          <stop offset="50%" stopColor="#D97706" /> {/* amber 600 */}
          <stop offset="85%" stopColor="#92400E" /> {/* amber 800 */}
          <stop offset="100%" stopColor="#78350F" /> {/* deep gold shadow */}
        </linearGradient>

        {/* Soft Inner Gold Glow */}
        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.05" />
        </linearGradient>

        {/* Traditional Islamic Deep Emerald Gradient */}
        <radialGradient id="emeraldBack" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#064E3B" /> {/* emerald 900 */}
          <stop offset="70%" stopColor="#022C22" /> {/* emerald 950 */}
          <stop offset="100%" stopColor="#011F18" /> {/* ultra-dark jade */}
        </radialGradient>

        {/* Premium Liquid Glass Deep Emerald Gradient */}
        <radialGradient id="liquidGlassBack" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#059669" /> {/* emerald 600 - refractive light center */}
          <stop offset="25%" stopColor="#047857" /> {/* emerald 700 */}
          <stop offset="50%" stopColor="#064E3B" /> {/* emerald 900 */}
          <stop offset="80%" stopColor="#022C22" /> {/* emerald 950 */}
          <stop offset="100%" stopColor="#011a14" /> {/* dark glass edge shadow */}
        </radialGradient>

        {/* Glossy specular highlight curve for liquid glass */}
        <linearGradient id="glassReflectionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Inner rim-light glow */}
        <linearGradient id="glassInnerGlow" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Soft Gold Gloss Overlay for the targeted third circle */}
        <radialGradient id="goldGlassGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#D97706" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer Glow Shadow Base */}
      <circle cx="60" cy="60" r="58" fill="rgba(4, 120, 87, 0.05)" />

      {/* Solid Dark Emerald Medallion Base (Upgraded to refractive Liquid Glass) */}
      <circle cx="60" cy="60" r="54" fill="url(#liquidGlassBack)" stroke="url(#logoGold)" strokeWidth="1.8" />

      {/* Liquid Glass Bottom Backlight Rim */}
      <circle cx="60" cy="60" r="53" fill="none" stroke="url(#glassInnerGlow)" strokeWidth="2.5" pointerEvents="none" />

      {/* Specular curved reflection representing glass refraction */}
      <path d="M 15 45 A 45 45 0 0 1 105 45 A 45 35 0 0 0 15 45 Z" fill="url(#glassReflectionGrad)" opacity="0.6" pointerEvents="none" />

      {/* Multi-layered Geometric Islamic Star (8-point Rub-el-Hizb style) */}
      <g stroke="url(#logoGold)" strokeWidth="0.8" fill="none" opacity="0.85">
        <rect x="22" y="22" width="76" height="76" rx="4" transform="rotate(0 60 60)" />
        <rect x="22" y="22" width="76" height="76" rx="4" transform="rotate(45 60 60)" />
        <rect x="22" y="22" width="76" height="76" rx="4" transform="rotate(22.5 60 60)" />
        <rect x="22" y="22" width="76" height="76" rx="4" transform="rotate(67.5 60 60)" />
      </g>

      {/* Elegant Inner Circular Border with delicate dots (Targeted 3rd Circle with Liquid Glass glow) */}
      <circle cx="60" cy="60" r="47" fill="url(#goldGlassGlow)" stroke="url(#logoGold)" strokeWidth="1.2" strokeDasharray="1 3" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="url(#logoGold)" strokeWidth="0.8" opacity="0.6" />

      {/* Micro-dot constellation for sacred aesthetics */}
      <g fill="url(#logoGold)" opacity="0.9">
        <circle cx="60" cy="14" r="1.5" />
        <circle cx="60" cy="106" r="1.5" />
        <circle cx="14" cy="60" r="1.5" />
        <circle cx="106" cy="60" r="1.5" />
        
        {/* Corner star bursts */}
        <polygon points="26,26 28,28 26,30 24,28" />
        <polygon points="94,26 96,28 94,30 92,28" />
        <polygon points="26,94 28,96 26,98 24,96" />
        <polygon points="94,94 96,96 94,98 92,96" />
      </g>

      {/* Crescent Moon & Star at the Top */}
      <g transform="translate(60, 24) scale(0.65)" fill="url(#logoGold)">
        {/* Symmetrical Crescent cradling a 5-point star */}
        <path d="M -8,-6 A 10,10 0 1,0 8,-6 A 8,8 0 1,1 -8,-6 Z" transform="rotate(-90)" />
        <polygon points="0,-12 3,-6 9,-5 5,0 6,6 0,3 -6,6 -5,0 -9,-5 -3,-6" transform="translate(0, -6) scale(0.4)" />
      </g>

      {/* Centered Urdu Calligraphy */}
      <g transform="translate(60, 58)" textAnchor="middle">
        {/* Shadow layer for depth */}
        <text
          x="0"
          y="-2"
          fill="#011F18"
          fontSize="12.5"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Amiri', 'Noto Serif Arabic', serif"
          style={{ letterSpacing: '0.02em' }}
        >
          حضرت عائشہ
        </text>
        <text
          x="0"
          y="11"
          fill="#011F18"
          fontSize="10"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Amiri', 'Noto Serif Arabic', serif"
        >
          اکیڈمی
        </text>

        {/* Foreground Calligraphy with golden sheen */}
        <text
          x="0"
          y="-3"
          fill="url(#logoGold)"
          fontSize="12.5"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Amiri', 'Noto Serif Arabic', serif"
          style={{ letterSpacing: '0.02em', filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.5))' }}
        >
          حضرت عائشہ
        </text>
        <text
          x="0"
          y="10"
          fill="url(#logoGold)"
          fontSize="10"
          fontWeight="bold"
          fontFamily="'Noto Nastaliq Urdu', 'Amiri', 'Noto Serif Arabic', serif"
          style={{ filter: 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.5))' }}
        >
          اکیڈمی
        </text>
      </g>

      {/* Beautiful Vector Open Quran / Academic Book of Wisdom at the bottom */}
      <g transform="translate(60, 84) scale(0.7)" fill="none" stroke="url(#logoGold)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Page */}
        <path d="M -15,4 Q -7,0 0,4 L 0,-6 Q -7,-10 -15,-6 Z" fill="url(#emeraldBack)" />
        {/* Right Page */}
        <path d="M 15,4 Q 7,0 0,4 L 0,-6 Q 7,-10 15,-6 Z" fill="url(#emeraldBack)" />
        {/* Book Stand / Rehal Base */}
        <path d="M -8,8 L 8,14" opacity="0.8" />
        <path d="M 8,8 L -8,14" opacity="0.8" />
        {/* Bookmark Ribbon */}
        <path d="M 0,4 L 0,11 L -2,9" strokeWidth="0.8" />
      </g>

      {/* Decorative floral vines on the left and right sides */}
      <g stroke="url(#logoGold)" strokeWidth="0.6" fill="none" opacity="0.7">
        {/* Left Vine */}
        <path d="M 23,60 Q 25,48 31,40" />
        <circle cx="31" cy="40" r="1" fill="url(#logoGold)" />
        <path d="M 23,60 Q 25,72 31,80" />
        <circle cx="31" cy="80" r="1" fill="url(#logoGold)" />

        {/* Right Vine */}
        <path d="M 97,60 Q 95,48 89,40" />
        <circle cx="89" cy="40" r="1" fill="url(#logoGold)" />
        <path d="M 97,60 Q 95,72 89,80" />
        <circle cx="89" cy="80" r="1" fill="url(#logoGold)" />
      </g>
    </svg>
  );
}
