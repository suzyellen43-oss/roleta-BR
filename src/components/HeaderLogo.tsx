import React from 'react';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { OneWinLogo } from './OneWinLogo';

interface HeaderLogoProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ soundEnabled, onToggleSound }) => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-3 pb-2 px-4 flex items-center justify-between relative z-10">
      {/* LOGO 1WIN BEM VISÍVEL E DESTACADA */}
      <div className="flex items-center">
        <div 
          id="brand-logo-container"
          className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-b from-[#081328]/95 to-[#040a17]/95 border border-blue-500/40 shadow-[0_0_20px_rgba(0,102,255,0.25)] transition-all hover:border-blue-400/60"
        >
          <OneWinLogo size="md" />
        </div>
      </div>

      {/* DIREITA: SELO DE SEGURANÇA E BOTÃO DE SOM */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs text-blue-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Promoção Oficial</span>
        </div>

        <button
          id="sound-toggle-btn"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? "Silenciar sons" : "Ativar sons"}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-blue-500/30 text-blue-200 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center"
          aria-label={soundEnabled ? "Desativar áudio" : "Ativar áudio"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          )}
        </button>
      </div>
    </header>
  );
};
