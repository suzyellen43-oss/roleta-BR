import React from 'react';

interface OneWinLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const OneWinLogo: React.FC<OneWinLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  // Ajuste de altura e proporção responsiva
  const sizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-11 md:h-12',
    lg: 'h-12 sm:h-14 md:h-16',
    xl: 'h-16 sm:h-20',
  }[size];

  return (
    <div 
      id="1win-brand-logo"
      className={`inline-flex items-center select-none ${className}`}
      aria-label="1win Oficial"
    >
      <svg
        className={`${sizeClasses} w-auto max-w-[190px] sm:max-w-[240px] drop-shadow-[0_4px_18px_rgba(24,119,242,0.4)] transition-transform hover:scale-105 duration-200`}
        viewBox="10 20 1960 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente azul vibrante original para o dígito '1' */}
          <linearGradient id="owBlueDigit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E88E5" />
            <stop offset="60%" stopColor="#1877F2" />
            <stop offset="100%" stopColor="#0D59CC" />
          </linearGradient>

          {/* Gradiente azul do pingo do 'i' */}
          <linearGradient id="owBlueDot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1877F2" />
          </linearGradient>

          {/* Filtro de profundidade */}
          <filter id="owGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#1877F2" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter="url(#owGlow)">
          {/* 1: DÍGITO '1' OFICIAL (AZUL) */}
          <path 
            d="M345.203 295.309c30.41 22.148 47.46 54.666 38.144 101.072l-60.116 321.496c-8.789 52.382-59.237 86.834-111.618 76.991-49.394-9.492-85.78-55.897-75.936-111.619l34.1-186.148-21.269 9.668c-39.374 17.753-85.779 0-103.357-39.726-17.577-39.726 0-86.307 39.374-104.236l158.727-70.487c37.441-18.808 73.124-16.347 101.951 2.989Z" 
            fill="url(#owBlueDigit)" 
          />

          {/* w: LETRA 'w' OFICIAL (BRANCO PURO) */}
          <path 
            d="M405.923 279.838c20.741 24.784 45.098 55.897 33.145 129.723l-32.519 174.195 5.976 140.271c1.231 49.921 25.137 72.42 67.323 72.42h105.818c33.574 0 47.108-25.663 60.643-58.007l80.682-199.155 8.262 190.191c.703 42.186 22.148 67.147 60.819 67.147h120.583c34.276 0 48.514-20.742 63.631-57.831l153.984-381.437c16.7-39.55 7.03-77.693-34.63-77.693h-77.52c-28.826 0-47.986 9.843-59.412 37.265l-103.884 255.58-9.492-227.983c-1.582-48.515-24.785-64.686-51.678-64.686h-78.573c-31.113 0-49.218 12.128-58.885 35.858L555.784 572.683l-9.316-233.609c-1.406-43.768-15.82-59.236-50.976-59.236h-89.569Z" 
            fill="#FFFFFF" 
          />

          {/* i stem: CORPO DO 'i' OFICIAL (BRANCO PURO) */}
          <path 
            d="M1246.41 796.447c46.58 0 58.01-34.979 64.69-74.529l65.92-361.75c11.95-55.37-1.59-80.682-54.5-80.682h-62.4c-50.97 0-68.37 24.96-75.23 65.741l-68.03 382.667c-6.67 38.495 7.21 68.553 46.76 68.553h82.79Z" 
            fill="#FFFFFF" 
          />

          {/* i dot: PONTO DO 'i' OFICIAL (AZUL) */}
          <path 
            d="M1305.83 225.525c51.5 0 93.33-41.835 93.33-93.338 0-51.503-41.83-93.338-93.33-93.338-51.51 0-93.34 41.836-93.34 93.338 0 51.679 41.83 93.338 93.34 93.338Z" 
            fill="url(#owBlueDot)" 
          />

          {/* n: LETRA 'n' OFICIAL (BRANCO PURO) */}
          <path 
            d="M1711.52 726.312l32.87-197.398c4.57-36.21-2.11-61.874-21.44-78.045-30.59-24.961-73.83-14.062-95.8 11.074-14.24 15.117-20.57 35.683-28.13 77.342l-33.04 182.808c-6.33 36.035-16.35 74.354-64.16 74.354h-81.39c-50.79 0-54.31-44.296-48.51-70.135l68.73-381.085c6.68-34.98 18.98-65.565 75.23-65.565h58.36c45.17 0 72.24 16.523 58.01 80.506l-6.16 31.64c31.12-63.807 107.76-112.322 175.08-112.322 50.97 0 74.35 8.965 102.65 34.452 47.11 42.187 55.9 105.467 45.35 155.563l-46.93 252.417c-6.5 38.143-16.52 74.529-62.58 74.529h-81.03c-35.33 0-54.14-25.839-47.11-70.135Z" 
            fill="#FFFFFF" 
          />
        </g>
      </svg>
    </div>
  );
};
