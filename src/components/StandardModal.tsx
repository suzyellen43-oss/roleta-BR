import React, { useEffect } from 'react';
import { X, Trophy, Sparkles, RotateCcw, ArrowRight, Frown, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectorItem } from '../types';
import { CAMPAIGN_CONFIG } from '../config';

interface StandardModalProps {
  isOpen: boolean;
  sector: SectorItem | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

export const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  sector,
  onClose,
  onSpinAgain,
}) => {
  useEffect(() => {
    if (!isOpen || !sector) return;

    // Disparar confetes em prêmios positivos (exceto 'nada')
    if (sector.type !== 'nothing') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0066FF', '#38BDF8', '#FFFFFF', '#FACC15'],
        });
      } catch {
        // Safe catch
      }
    }
  }, [isOpen, sector]);

  if (!isOpen || !sector) return null;

  const isNothing = sector.type === 'nothing';
  const isSpinAgain = sector.type === 'spin_again';
  const isCash = sector.type === 'cash';
  const isSpins = sector.type === 'spins';
  const isMystery = sector.type === 'mystery';

  return (
    <div 
      id="standard-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="standard-modal-content"
        className="relative w-full max-w-md bg-gradient-to-b from-[#0B1A36] via-[#071329] to-[#030814] rounded-2xl sm:rounded-3xl border border-blue-500/40 p-6 sm:p-7 text-center shadow-[0_0_50px_rgba(0,102,255,0.4)] overflow-hidden animate-[scaleIn_0.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* BOTÃO "X" */}
        <button
          id="close-standard-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Fechar janela"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-blue-400/30 transition-all duration-200 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* BRILHO DE FUNDO */}
        <div className="absolute -top-12 inset-x-0 h-28 bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* ÍCONE DO RESULTADO */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-blue-900/60">
          {isNothing ? (
            <Frown className="w-8 h-8 text-slate-400" />
          ) : isMystery ? (
            <Gift className="w-8 h-8 text-yellow-400 animate-bounce" />
          ) : isSpinAgain ? (
            <RotateCcw className="w-8 h-8 text-cyan-300" />
          ) : (
            <Trophy className="w-8 h-8 text-yellow-400 animate-pulse" />
          )}
        </div>

        {/* CABEÇALHO DO RESULTADO */}
        <div className="space-y-1 mb-5">
          {isNothing ? (
            <div className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-xs font-bold text-slate-300 uppercase tracking-wider">
              NÃO FOI DESSA VEZ
            </div>
          ) : isMystery ? (
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              🎁 SEU RESULTADO
            </div>
          ) : isSpinAgain ? (
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              🔄 TENTATIVA EXTRA
            </div>
          ) : (
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              🎉 PARABÉNS!
            </div>
          )}

          <h3 className="text-sm sm:text-base font-semibold text-slate-300 uppercase tracking-wide pt-1">
            {isNothing 
              ? "Que pena! Você tirou:" 
              : (isMystery ? "Você conseguiu:" : "Você ganhou:")
            }
          </h3>

          {/* NOME DO PRÊMIO */}
          <div className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight py-2 bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
            {sector.label}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
            {isNothing && "Não desanime! A sorte pode estar no seu próximo giro."}
            {isSpinAgain && "Você ganhou mais uma chance grátis para girar a roleta!"}
            {isMystery && "Seu prêmio misterioso foi reservado! Cadastre-se para revelá-lo."}
            {isCash && "Seu saldo promocional já está pronto para ser creditado na sua conta."}
            {isSpins && "Seus giros grátis exclusivos já estão prontos para serem ativados!"}
          </p>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="space-y-2.5 pt-2">
          {!isNothing && !isSpinAgain && (
            <a
              id="claim-prize-btn"
              href={CAMPAIGN_CONFIG.REGISTER_URL}
              target={CAMPAIGN_CONFIG.REGISTER_TARGET}
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-blue-600/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>RESGATAR PRÊMIO</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}

          {/* BOTÃO PARA GIRAR DE NOVO */}
          <button
            id="modal-spin-again-btn"
            type="button"
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className={`
              w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl
              font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200
              ${isNothing || isSpinAgain
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
              }
            `}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isNothing ? "TENTAR DE NOVO" : "GIRAR DE NOVO"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
