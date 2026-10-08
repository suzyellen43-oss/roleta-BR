import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { SectorItem } from '../types';
import { SECTORS } from '../data/sectors';
import { sound } from '../utils/audio';
import { CAMPAIGN_CONFIG } from '../config';

interface RouletteWheelProps {
  isSpinning: boolean;
  rotation: number;
  onSpinClick: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  isSpinning,
  rotation,
  onSpinClick,
}) => {
  const previousRotationRef = useRef(rotation);

  // Som de tick durante a rotação
  useEffect(() => {
    if (!isSpinning) return;

    let cancelled = false;
    const duration = CAMPAIGN_CONFIG.SPIN_DURATION_MS;
    const startTime = Date.now();

    // Ticks realistas desacelerando
    const scheduleNextTick = (delay: number) => {
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        sound.playTick();

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 0.95) {
          // Desaceleração exponencial do som de clique
          const nextDelay = 45 + Math.pow(progress, 2.5) * 450;
          scheduleNextTick(nextDelay);
        }
      }, delay);
    };

    scheduleNextTick(30);

    return () => {
      cancelled = true;
    };
  }, [isSpinning]);

  useEffect(() => {
    previousRotationRef.current = rotation;
  }, [rotation]);

  // Geometria da Roleta para 8 setores
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 218;
  const innerRadius = 72;

  const numSectors = SECTORS.length;
  const sectorAngle = 360 / numSectors; // 45° para 8 setores
  const halfAngle = sectorAngle / 2; // 22.5°

  // Setor base (de -22.5° a +22.5°, centrado em 0° / Topo)
  const angleRad1 = (-halfAngle - 90) * (Math.PI / 180);
  const angleRad2 = (halfAngle - 90) * (Math.PI / 180);

  const xOut1 = cx + outerRadius * Math.cos(angleRad1);
  const yOut1 = cy + outerRadius * Math.sin(angleRad1);
  const xOut2 = cx + outerRadius * Math.cos(angleRad2);
  const yOut2 = cy + outerRadius * Math.sin(angleRad2);

  const xIn2 = cx + innerRadius * Math.cos(angleRad2);
  const yIn2 = cy + innerRadius * Math.sin(angleRad2);
  const xIn1 = cx + innerRadius * Math.cos(angleRad1);
  const yIn1 = cy + innerRadius * Math.sin(angleRad1);

  const slicePath = `M ${xIn1} ${yIn1} L ${xOut1} ${yOut1} A ${outerRadius} ${outerRadius} 0 0 1 ${xOut2} ${yOut2} L ${xIn2} ${yIn2} A ${innerRadius} ${innerRadius} 0 0 0 ${xIn1} ${yIn1} Z`;

  // Pinos luminosos externos (24 pinos ao redor da moldura = 3 pinos por setor de 45°)
  const pinRadius = 233;
  const pins = Array.from({ length: 24 }).map((_, i) => {
    const angle = i * 15 * (Math.PI / 180);
    return {
      id: i,
      x: cx + pinRadius * Math.cos(angle),
      y: cy + pinRadius * Math.sin(angle),
      isMajor: i % 3 === 0,
    };
  });

  return (
    <div 
      id="roulette-section"
      className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[490px] mx-auto aspect-square flex items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* GLOW DE FUNDO AZUL PROFUNDO */}
      <div 
        className="absolute inset-4 rounded-full bg-blue-600/20 blur-3xl pointer-events-none -z-10 animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div 
        className="absolute inset-10 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none -z-10" 
      />

      {/* MOLDURA EXTERNA ESTÁTICA / ARO DE LUXO */}
      <div className="relative w-full h-full rounded-full shadow-[0_12px_45px_rgba(0,10,35,0.85)] flex items-center justify-center">
        
        {/* SVG DA ROLETA */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform transition-transform duration-700"
          style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))' }}
        >
          {/* DEFINIÇÕES DE GRADIENTES METÁLICOS E DE BRILHO */}
          <defs>
            {/* Gradiente do aro exterior cromado/metálico */}
            <linearGradient id="metallicRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="25%" stopColor="#94A3B8" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="outerBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="35%" stopColor="#0F172A" />
              <stop offset="70%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="pointerGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <linearGradient id="vibrantBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="50%" stopColor="#0062E6" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            <linearGradient id="darkBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#071324" />
              <stop offset="70%" stopColor="#0B192C" />
              <stop offset="100%" stopColor="#0F2744" />
            </linearGradient>

            {/* Gradientes especiais para a sacola de dinheiro AMARELA e as 3 notas verdes */}
            <radialGradient id="moneyBagGoldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#CA8A04" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0062E6" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="bagBodyGoldGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="25%" stopColor="#FACC15" />
              <stop offset="65%" stopColor="#EAB308" />
              <stop offset="85%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>

            <linearGradient id="bagTopGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="bagRibbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="40%" stopColor="#F87171" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            <linearGradient id="dollarBillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="dollarBillLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="80%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Sombra dos setores */}
            <filter id="sectorShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ARO EXTERNO METÁLICO COM DETALHES LUMINOSOS */}
          <circle
            cx={cx}
            cy={cy}
            r={245}
            fill="url(#outerBezelGrad)"
            stroke="url(#metallicRing)"
            strokeWidth="5"
          />

          {/* ANEL INTERMEDIÁRIO COM DETALHES ESTILO CASINO */}
          <circle
            cx={cx}
            cy={cy}
            r={223}
            fill="none"
            stroke="#1E293B"
            strokeWidth="10"
          />

          {/* PINOS METÁLICOS / LÂMPADAS LUMINOSAS AO REDOR */}
          {pins.map((pin) => (
            <g key={pin.id}>
              {/* Resplendor do pino */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pin.isMajor ? 6 : 4.5}
                fill={pin.isMajor ? "#38BDF8" : "#94A3B8"}
                opacity={isSpinning ? (pin.id % 2 === 0 ? "0.9" : "0.5") : "0.75"}
              />
              {/* Núcleo do pino metálico */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={pin.isMajor ? 3.8 : 2.8}
                fill="url(#metallicRing)"
                stroke="#0F172A"
                strokeWidth="0.8"
              />
            </g>
          ))}

          {/* ========================================================
              RODA GIRATÓRIA PRINCIPAL (GIRA SOB O PONTEIRO)
             ======================================================== */}
          <g
            id="roulette-spinning-wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: isSpinning
                ? `transform ${CAMPAIGN_CONFIG.SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.95, 0.22, 1)`
                : 'none',
              willChange: 'transform',
            }}
          >
            {/* Base dos 8 setores */}
            {SECTORS.map((sector: SectorItem) => {
              const rotationAngle = sector.index * sectorAngle;
              const isWhite = sector.bgColor === '#FFFFFF' || sector.bgColor === '#F8FAFC';

              return (
                <g
                  key={`sector-${sector.id}`}
                  transform={`rotate(${rotationAngle} ${cx} ${cy})`}
                >
                  {/* Fatia do setor */}
                  <path
                    d={slicePath}
                    fill={
                      isWhite
                        ? '#FFFFFF'
                        : (sector.bgColor === '#0062E6' ? 'url(#vibrantBlueGrad)' : 'url(#darkBlueGrad)')
                    }
                    stroke="url(#metallicRing)"
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />

                  {/* Toque de brilho sutil na borda externa do setor */}
                  <path
                    d={`M ${xOut1} ${yOut1} A ${outerRadius} ${outerRadius} 0 0 1 ${xOut2} ${yOut2}`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeOpacity="0.4"
                  />

                  {/* CONTEÚDO DO SETOR (TEXTOS RADIAIS E DESENHO DE DINHEIRO) */}
                  <g transform={`translate(${cx}, ${cy})`}>
                    
                    {/* Linha 1 do texto do prêmio */}
                    <text
                      x="0"
                      y={sector.displayLine2 ? -182 : -176}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={sector.textColor}
                      fontSize={sector.displayLine1.length > 6 ? "14.5" : "16.5"}
                      fontWeight="900"
                      letterSpacing="0.03em"
                      className="font-extrabold select-none"
                      style={{
                        textShadow: isWhite
                          ? '0 1px 2px rgba(255,255,255,0.8)'
                          : '0 1px 4px rgba(0,0,0,0.85)',
                      }}
                    >
                      {sector.displayLine1}
                    </text>

                    {/* Linha 2 do texto (se houver, ex: Gire de novo) */}
                    {sector.displayLine2 && (
                      <text
                        x="0"
                        y={-166}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={sector.textColor}
                        fontSize="12"
                        fontWeight="800"
                        letterSpacing="0.02em"
                        opacity={0.95}
                        className="font-bold select-none"
                        style={{
                          textShadow: isWhite
                            ? '0 1px 2px rgba(255,255,255,0.8)'
                            : '0 1px 3px rgba(0,0,0,0.8)',
                        }}
                      >
                        {sector.displayLine2}
                      </text>
                    )}

                    {/* ========================================================
                        SACOLA DE DINHEIRO AMARELA COM 3 NOTAS VERDES EM VOLTA
                        Visual marcante de riqueza e prêmio estilo cassino
                       ======================================================== */}
                    <g transform="translate(0, -125)">
                      {/* Brilho dourado suave sob a sacola e as notas */}
                      <ellipse cx="0" cy="5" rx="28" ry="18" fill="url(#moneyBagGoldGlow)" />

                      {/* --- EXATAMENTE 3 NOTAS DE DÓLAR VERDES EM VOLTA --- */}
                      {/* NOTA 1: Esquerda superior (inclinada a -22°) */}
                      <g transform="translate(-17, 0) rotate(-22)">
                        <rect x="-14" y="-7.5" width="28" height="15" rx="1.5" fill="url(#dollarBillGrad)" stroke="#064E3B" strokeWidth="0.8" />
                        <rect x="-12.5" y="-6" width="25" height="12" rx="1" fill="none" stroke="#A7F3D0" strokeWidth="0.5" strokeDasharray="1.2,0.8" />
                        <ellipse cx="0" cy="0" rx="4.5" ry="3.8" fill="#065F46" stroke="#A7F3D0" strokeWidth="0.4" />
                        <text x="0" y="2" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#ECFDF5" className="select-none font-black font-mono">$</text>
                      </g>

                      {/* NOTA 2: Direita superior (inclinada a +22°) */}
                      <g transform="translate(17, 0) rotate(22)">
                        <rect x="-14" y="-7.5" width="28" height="15" rx="1.5" fill="url(#dollarBillGrad)" stroke="#064E3B" strokeWidth="0.8" />
                        <rect x="-12.5" y="-6" width="25" height="12" rx="1" fill="none" stroke="#A7F3D0" strokeWidth="0.5" strokeDasharray="1.2,0.8" />
                        <ellipse cx="0" cy="0" rx="4.5" ry="3.8" fill="#065F46" stroke="#A7F3D0" strokeWidth="0.4" />
                        <text x="0" y="2" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#ECFDF5" className="select-none font-black font-mono">$</text>
                      </g>

                      {/* --- SACOLA DE DINHEIRO AMARELA / DOURADA DESTACADA --- */}
                      {/* Boca franzida superior da sacola (amarela) */}
                      <path
                        d="M -8 -7 C -12 -14, -8 -16, -4 -11 C -1 -17, 3 -17, 5 -11 C 9 -16, 12 -14, 8 -7 Z"
                        fill="url(#bagTopGoldGrad)"
                        stroke="#B45309"
                        strokeWidth="0.9"
                      />

                      {/* Barriga arredondada volumosa da sacola AMARELA */}
                      <path
                        d="M -7 -6 C -15 0, -19 8, -17 16 C -15 22, -7 23, 0 23 C 7 23, 15 22, 17 16 C 19 8, 15 0, 7 -6 Z"
                        fill="url(#bagBodyGoldGrad)"
                        stroke="#B45309"
                        strokeWidth="1.1"
                      />

                      {/* Fita vermelha de amarra no pescoço do saco */}
                      <path
                        d="M -8.5 -6.5 C -4 -5, 4 -5, 8.5 -6.5 C 9.5 -6, 9.5 -4, 8.5 -3.5 C 4 -2, -4 -2, -8.5 -3.5 C -9.5 -4, -9.5 -6, -8.5 -6.5 Z"
                        fill="url(#bagRibbonRed)"
                        stroke="#7F1D1D"
                        strokeWidth="0.6"
                      />

                      {/* Laço / pontas caídas da fita */}
                      <circle cx="-1.5" cy="-3.5" r="1.6" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.4" />
                      <path d="M -2 -3 C -4 0, -5 3, -4 5.5" fill="none" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M -1 -3 C -0.5 0, 0 3, 1.5 5" fill="none" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" />

                      {/* Brilho 3D de relevo na lateral da sacola amarela */}
                      <path
                        d="M -11 4 C -14 9, -12 16, -9 18"
                        fill="none"
                        stroke="#FEF08A"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.8"
                      />

                      {/* EMBLEMA DO CIFRÃO ($) BEM VISÍVEL NO CENTRO DA SACOLA */}
                      <circle cx="0" cy="9.5" r="7.2" fill="#78350F" opacity="0.85" />
                      <circle cx="0" cy="9.5" r="6.2" fill="url(#goldCoinGrad)" stroke="#FEF08A" strokeWidth="0.8" />
                      <text
                        x="0"
                        y="13"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="900"
                        fill="#78350F"
                        className="font-black select-none font-mono"
                        style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.6))' }}
                      >
                        $
                      </text>

                      {/* NOTA 3: Frontal na base (inclinada levemente a -3°) */}
                      <g transform="translate(0, 19) rotate(-3)">
                        <rect x="-15" y="-7" width="30" height="14" rx="1.5" fill="url(#dollarBillLightGrad)" stroke="#064E3B" strokeWidth="0.8" />
                        <rect x="-13.5" y="-5.5" width="27" height="11" rx="1" fill="none" stroke="#A7F3D0" strokeWidth="0.5" strokeDasharray="1.2,0.8" />
                        <ellipse cx="0" cy="0" rx="4.2" ry="3.4" fill="#065F46" stroke="#A7F3D0" strokeWidth="0.4" />
                        <text x="0" y="1.8" textAnchor="middle" fontSize="5" fontWeight="900" fill="#ECFDF5" className="select-none font-black font-mono">$</text>
                      </g>

                      {/* Brilhos cintilantes ao redor (Sparkles) */}
                      <path
                        d="M -14 -6 Q -14 -2 -18 -2 Q -14 -2 -14 2 Q -14 -2 -10 -2 Q -14 -2 -14 -6 Z"
                        fill="#FFFFFF"
                        opacity="0.9"
                      />
                      <path
                        d="M 14 -4 Q 14 -1 11 -1 Q 14 -1 14 2 Q 14 -1 17 -1 Q 14 -1 14 -4 Z"
                        fill="#FEF08A"
                        opacity="0.85"
                      />
                      <circle cx="10" cy="16" r="1" fill="#FFFFFF" opacity="0.9" />
                      <circle cx="-12" cy="11" r="1" fill="#FFFFFF" opacity="0.9" />
                    </g>

                  </g>
                </g>
              );
            })}

            {/* ARO INTERNO CROMADO DA ROLETA */}
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius}
              fill="none"
              stroke="url(#metallicRing)"
              strokeWidth="4"
            />
          </g>

          {/* ANEL CENTRAL FIXO DE PROFUNDIDADE */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius - 2}
            fill="#030712"
            stroke="#1D4ED8"
            strokeWidth="3"
            opacity="0.9"
          />
        </svg>

        {/* ========================================================
            PONTEIRO SUPERIOR FIXO (INDICA O SETOR SORTEADO)
           ======================================================== */}
        <div 
          id="roulette-pointer"
          className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)]"
        >
          {/* Suporte superior do ponteiro */}
          <div className="w-10 sm:w-12 h-4 sm:h-5 rounded-t-lg bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 border border-slate-300 flex items-center justify-center shadow-inner">
            <div className="w-3 h-1.5 rounded-full bg-blue-600 shadow-sm shadow-cyan-400"></div>
          </div>

          {/* Seta / Ponta afiada que aponta com precisão para o setor */}
          <div className="relative">
            <svg
              width="36"
              height="38"
              viewBox="0 0 36 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="filter drop-shadow-md"
            >
              <path
                d="M 18 36 L 4 6 C 2 3 4 0 7 0 L 29 0 C 32 0 34 3 32 6 Z"
                fill="url(#pointerGrad)"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              {/* Linha central reflexiva */}
              <path
                d="M 18 34 L 18 2"
                stroke="#FFFFFF"
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Joia luminosa azul no centro do ponteiro */}
              <circle
                cx="18"
                cy="11"
                r="4.5"
                fill="#0066FF"
                stroke="#38BDF8"
                strokeWidth="1.2"
              />
              <circle
                cx="18"
                cy="11"
                r="2"
                fill="#FFFFFF"
              />

              <defs>
                <linearGradient id="pointerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="40%" stopColor="#CBD5E1" />
                  <stop offset="70%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ========================================================
            BOTÃO CENTRAL "APERTE PARA GIRAR"
            Visível, integrado e grande no meio da roleta
           ======================================================== */}
        <div 
          id="center-button-container"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <button
            id="spin-button"
            type="button"
            disabled={isSpinning}
            onClick={onSpinClick}
            aria-label="Toque para girar a roleta"
            className={`
              group relative flex flex-col items-center justify-center
              w-[124px] h-[124px] sm:w-[136px] sm:h-[136px]
              rounded-full
              text-center transition-all duration-300
              ${isSpinning 
                ? 'cursor-not-allowed opacity-90 scale-95' 
                : 'cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(0,102,255,0.7)]'
              }
            `}
          >
            {/* Aro externo cromado do botão com efeito 3D */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400 via-white to-slate-500 p-[3.5px] shadow-2xl">
              {/* Anel azul neon interno */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-blue-400 to-blue-900 p-[2.5px]">
                {/* Núcleo do botão com gradiente de alta profundidade */}
                <div className={`
                  w-full h-full rounded-full flex flex-col items-center justify-center
                  bg-gradient-to-b from-[#0055d4] via-[#003da6] to-[#00246b]
                  shadow-inner relative overflow-hidden
                  ${!isSpinning ? 'group-hover:from-[#0066ff] group-hover:to-[#002f8a]' : ''}
                `}>
                  {/* Brilho de reflexo no topo do botão */}
                  <div className="absolute top-1 inset-x-3 h-5 rounded-full bg-white/20 blur-[1px] pointer-events-none" />

                  {/* Texto do Botão com alto contraste e legibilidade */}
                  <div className="flex flex-col items-center justify-center leading-tight z-10 px-2">
                    {isSpinning ? (
                      <div className="flex flex-col items-center gap-1">
                        <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
                        <span className="text-[11px] sm:text-xs font-black tracking-widest text-cyan-200 uppercase">
                          GIRANDO...
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-[11px] sm:text-[12px] font-extrabold tracking-wider text-cyan-200 uppercase drop-shadow-md">
                          TOQUE
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-white/80 uppercase">
                          PARA
                        </span>
                        <span className="text-[13px] sm:text-[14.5px] font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          GIRAR
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Anel pulsante quando ocioso para atrair o clique */}
            {!isSpinning && (
              <div className="absolute -inset-1 rounded-full border-2 border-cyan-400/50 animate-ping pointer-events-none opacity-40" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
