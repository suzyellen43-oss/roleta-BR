import React, { useEffect } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAMPAIGN_CONFIG } from '../config';

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose }) => {
  // Disparar confetes festivos ao abrir o pop-up
  useEffect(() => {
    if (!isOpen) return;

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.55 },
        colors: ['#00E676', '#38BDF8', '#FFFFFF', '#F5B738'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 50,
          origin: { x: 0 },
          colors: ['#00E676', '#F5B738', '#FFFFFF'],
        });

        confetti({
          particleCount: 45,
          angle: 120,
          spread: 50,
          origin: { x: 1 },
          colors: ['#00E676', '#F5B738', '#FFFFFF'],
        });
      }, 250);

      return () => clearTimeout(timer);
    } catch {
      // Ignorar caso confetes não estejam disponíveis
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="bonus-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* CONTAINER DO MODAL COM SCROLL SUAVE PARA CELULARES */}
      <div
        id="bonus-modal-content"
        className="relative w-full max-w-[420px] max-h-[92vh] overflow-y-auto custom-scrollbar bg-[#152136] rounded-3xl border border-slate-700/60 shadow-[0_15px_60px_rgba(0,0,0,0.85)] p-5 sm:p-6 animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* TOPO: TÍTULO "Parabéns! Você recebeu:" E BOTÃO FECHAR "X" */}
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Parabéns! Você recebeu:
          </h2>

          <button
            id="close-bonus-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTAINER INTERNO ESCURO */}
        <div className="bg-[#0e1626] rounded-2xl p-4 sm:p-5 border border-slate-800/80 mb-4 text-left">
          
          {/* BARRA DE PORCENTAGEM (0 A 100 - PREENCHIDA EM 95,70%) COLADA EM CIMA DO VALOR */}
          <div className="w-full max-w-[320px] mx-auto mb-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-0.5">
              <span className="font-semibold text-slate-400">0%</span>
              <span className="text-[#F5B738] font-black tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 text-[11px] shadow-sm">
                95,70%
              </span>
              <span className="font-semibold text-slate-400">100%</span>
            </div>

            {/* Trilho da barra de porcentagem */}
            <div className="relative w-full h-3 sm:h-3.5 rounded-full bg-slate-950 border border-slate-700/80 p-[2px] overflow-hidden shadow-inner">
              {/* Preenchimento ocupando exatamente 95,70% da barra */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#F5B738] to-[#00E676] shadow-[0_0_12px_rgba(245,183,56,0.6)] relative overflow-hidden transition-all duration-500"
                style={{ width: '95.7%' }}
              >
                {/* Efeito de brilho em movimento */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer_2.2s_infinite]" />
              </div>
            </div>
          </div>

          {/* VALOR DO PRÊMIO CENTRALIZADO: R$ 95,70 */}
          <div className="text-center py-0.5">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#F5B738] tracking-tight font-sans">
              R$ 95,70
            </div>
            <p className="text-xs sm:text-[13px] text-slate-400 font-normal mt-0.5">
              O valor que você já possui
            </p>
          </div>

          {/* INFORMAÇÕES DE STATUS */}
          <div className="mt-4 space-y-1.5">
            <div className="text-xs sm:text-sm font-extrabold text-[#F5B738] tracking-wide uppercase">
              COMPLETE R$ 100,00 PARA SACAR.
            </div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Método de Pagamento
            </div>
          </div>

          {/* CAIXA DE TIMELINE / ETAPAS DE PROGRESSO COM LINHA PONTILHADA */}
          <div className="relative mt-3.5 p-3.5 sm:p-4 rounded-xl bg-[#18253b] border border-slate-700/40">
            {/* Linha vertical pontilhada conectando os passos */}
            <div className="absolute left-[24px] top-[26px] bottom-[28px] w-0 border-l-[1.5px] border-dotted border-slate-500/60 pointer-events-none" />

            <div className="space-y-4">
              {/* ETAPA 1: Pedido de pagamento foi enviado */}
              <div className="flex items-start gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 z-10 shadow-sm mt-0.5">
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                </div>
                <div className="text-xs sm:text-[13px] text-slate-200 font-medium leading-snug">
                  Pedido de pagamento foi enviado
                </div>
              </div>

              {/* ETAPA 2: Ainda faltam 4,30 para você solicitar o saque agora mesmo! */}
              <div className="flex items-start gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 z-10 shadow-sm mt-0.5">
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                </div>
                <div className="text-xs sm:text-[13px] text-slate-200 font-medium leading-snug">
                  Ainda faltam 4,30 para você solicitar o saque agora mesmo!
                </div>
              </div>

              {/* ETAPA 3: Complete R$ 100,00 e o valor será depositado em sua conta. */}
              <div className="flex items-start gap-3 relative">
                <div className="w-5 h-5 rounded-full bg-slate-600/70 border border-slate-400 flex items-center justify-center flex-shrink-0 z-10 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                </div>
                <div className="text-xs sm:text-[13px] text-slate-300 font-medium leading-snug">
                  Complete R$ 100,00 e o valor será depositado em sua conta.
                </div>
              </div>
            </div>
          </div>

          {/* NOVO BLOCO: LIBERE MAIS 1 GIRO COM PASSO A PASSO */}
          <div className="mt-3.5 p-3.5 rounded-xl bg-[#141e30] border border-blue-500/30 text-left space-y-2">
            <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
              <span>LIBERE MAIS 1 GIRO</span>
            </div>

            <div className="space-y-1.5 text-xs sm:text-[12.5px] text-slate-200">
              <div className="flex items-start gap-2">
                <span className="text-[#00E676] font-bold flex-shrink-0">✓</span>
                <span className="font-medium">1. Faça seu cadastro na plataforma.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00E676] font-bold flex-shrink-0">✓</span>
                <span className="font-medium">2. Realize seu primeiro depósito de qualquer valor.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00E676] font-bold flex-shrink-0">✓</span>
                <span className="font-medium leading-relaxed">
                  3. Após a confirmação do seu primeiro depósito, a roleta aparecerá automaticamente na sua tela novamente com 1 novo giro liberado.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTÃO PRINCIPAL VERDE: "LIBERAR MAIS 1 GIRO" */}
        <a
          id="cta-invite-friends-btn"
          href={CAMPAIGN_CONFIG.REGISTER_URL}
          target={CAMPAIGN_CONFIG.REGISTER_TARGET}
          rel="noopener noreferrer"
          onClick={() => {
            (window as any).fbq?.('track', 'Purchase', {
              value: 95.70,
              currency: 'BRL'
            });
          }}
          className="w-full flex items-center justify-center py-3.5 sm:py-4 px-6 rounded-2xl bg-[#00E676] hover:bg-[#00D069] text-[#022c15] font-black text-sm sm:text-base tracking-wide uppercase transition-all duration-200 shadow-[0_8px_25px_rgba(0,230,118,0.35)] active:scale-[0.98] cursor-pointer"
        >
          <span>LIBERAR MAIS 1 GIRO</span>
        </a>

      </div>
    </div>
  );
};
