import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, Shield, Gift, HelpCircle, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeaderLogo } from './components/HeaderLogo';
import { RouletteWheel } from './components/RouletteWheel';
import { BonusModal } from './components/BonusModal';
import { StandardModal } from './components/StandardModal';
import { SECTORS } from './data/sectors';
import { SectorItem } from './types';
import { sound } from './utils/audio';
import { CAMPAIGN_CONFIG } from './config';

export default function App() {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedSector, setSelectedSector] = useState<SectorItem | null>(null);
  
  // Modais de resultado
  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);
  const [showStandardModal, setShowStandardModal] = useState<boolean>(false);
  
  // Controle de som
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Controle de giros e primeiro depósito com persistência segura
  const [firstSpinUsed, setFirstSpinUsed] = useState<boolean>(() => {
    return localStorage.getItem('roulette_first_spin_used') === 'true';
  });
  const [depositConfirmed, setDepositConfirmed] = useState<boolean>(() => {
    return localStorage.getItem('roulette_deposit_confirmed') === 'true';
  });
  const [secondSpinUsed, setSecondSpinUsed] = useState<boolean>(() => {
    return localStorage.getItem('roulette_second_spin_used') === 'true';
  });

  // Quantidade exata de giros disponíveis
  const [spinsAvailable, setSpinsAvailable] = useState<number>(() => {
    const fUsed = localStorage.getItem('roulette_first_spin_used') === 'true';
    const depConf = localStorage.getItem('roulette_deposit_confirmed') === 'true';
    const sUsed = localStorage.getItem('roulette_second_spin_used') === 'true';

    if (!fUsed) return 1;
    if (depConf && !sUsed) return 1;
    return 0;
  });

  // Mensagem temporária: "NOVO GIRO LIBERADO!"
  const [showNewSpinBanner, setShowNewSpinBanner] = useState<boolean>(false);

  // Status visual da roleta
  const [statusMessage, setStatusMessage] = useState<string>("Toque no botão central para girar!");

  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Alternar som
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  /**
   * =========================================================================
   * FUNÇÃO OFICIAL: confirmarPrimeiroDeposito()
   * =========================================================================
   * Preparada para receber a confirmação real do backend / API / webhook.
   * Regras estritas atendidas:
   * 1. Marca o primeiro depósito como confirmado.
   * 2. Libera exatamente 1 novo giro.
   * 3. Faz a roleta aparecer e estar pronta para girar novamente.
   * 4. Exibe a notificação temporária solicitada por alguns segundos.
   * 5. Impede que a mesma confirmação gere múltiplos giros (idempotente).
   */
  const confirmarPrimeiroDeposito = useCallback(() => {
    const isAlreadyConfirmed = localStorage.getItem('roulette_deposit_confirmed') === 'true';
    if (isAlreadyConfirmed) {
      console.info("Depósito já confirmado anteriormente. Benefício já concedido.");
      return false;
    }

    // 1. Marcar depósito como confirmado no storage
    localStorage.setItem('roulette_deposit_confirmed', 'true');
    setDepositConfirmed(true);

    // 2. Liberar exatamente 1 novo giro
    setSpinsAvailable(1);

    // 3. Fechar pop-up para a roleta reaparecer automaticamente limpa
    setShowBonusModal(false);
    setShowStandardModal(false);

    // 4. Rolar suavemente até a roleta para ficar totalmente visível
    setTimeout(() => {
      const rouletteEl = document.getElementById('roulette-section');
      if (rouletteEl) {
        rouletteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // 5. Exibir a mensagem temporária solicitada
    setShowNewSpinBanner(true);
    setTimeout(() => {
      setShowNewSpinBanner(false);
    }, 7000);

    // 6. Atualizar status
    setStatusMessage("🎉 1 Novo giro liberado! Toque para girar!");
    sound.playWin();

    return true;
  }, []);

  // Expor no window e adicionar listeners de integração real
  useEffect(() => {
    (window as any).confirmarPrimeiroDeposito = confirmarPrimeiroDeposito;

    // Suporte a mensagens enviadas por popups ou iframes da plataforma
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'DEPOSIT_CONFIRMED' || 
        event.data?.type === 'FIRST_DEPOSIT_CONFIRMED' ||
        event.data?.event === 'first_deposit'
      ) {
        confirmarPrimeiroDeposito();
      }
    };
    window.addEventListener('message', handleMessage);

    // Suporte caso o usuário retorne da plataforma com parâmetro de confirmação de depósito
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('deposit_confirmed') === 'true' || urlParams.get('first_deposit') === 'true') {
      confirmarPrimeiroDeposito();
      urlParams.delete('deposit_confirmed');
      urlParams.delete('first_deposit');
      const newQuery = urlParams.toString();
      const newPath = window.location.pathname + (newQuery ? `?${newQuery}` : '');
      window.history.replaceState({}, '', newPath);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      delete (window as any).confirmarPrimeiroDeposito;
    };
  }, [confirmarPrimeiroDeposito]);

  // INÍCIO DO GIRO DA ROLETA
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    // Fechar modais e banner ao iniciar o giro
    setShowBonusModal(false);
    setShowStandardModal(false);
    setShowNewSpinBanner(false);
    setIsSpinning(true);
    setStatusMessage("Girando a roleta da sorte... Boa sorte!");

    // SELEÇÃO DO RESULTADO:
    // Sempre parar exclusivamente em um dos prêmios que tem '?' ("???", "????", "??")
    const questionIndices = SECTORS
      .map((s, idx) => s.label.includes('?') ? idx : -1)
      .filter(idx => idx !== -1);
    
    const targetIndex = questionIndices.length > 0
      ? questionIndices[Math.floor(Math.random() * questionIndices.length)]
      : 3;
    const chosenSector = SECTORS[targetIndex];

    // CÁLCULO FÍSICO PRECISO DO ÂNGULO
    const sectorAngle = 360 / SECTORS.length;
    const halfSectorAngle = sectorAngle / 2;

    // Setor targetIndex está centrado em (targetIndex * sectorAngle) graus
    // Para alinhá-lo perfeitamente ao ponteiro no topo (0°):
    const targetNormalized = (360 - (targetIndex * sectorAngle)) % 360;
    const currentNormalized = rotation % 360;
    
    let delta = (targetNormalized - currentNormalized) % 360;
    if (delta <= 0) delta += 360;

    // Mínimo de voltas completas para animação realista de 4 a 6 segundos
    const fullTurns = (CAMPAIGN_CONFIG.MIN_FULL_REVOLUTIONS + Math.floor(Math.random() * 2)) * 360;
    
    // Pequena variação aleatória de até +/- 4 graus para naturalidade mecânica
    const microJitter = (Math.random() - 0.5) * 8;

    const nextRotation = rotation + fullTurns + delta + microJitter;
    setRotation(nextRotation);

    // Identificar matematicamente o setor exato parado sob o ponteiro
    const finalNormalized = ((360 - (nextRotation % 360)) % 360 + 360) % 360;
    const verifiedIndex = Math.floor(((finalNormalized + halfSectorAngle) % 360) / sectorAngle);
    const exactStoppedSector = SECTORS[verifiedIndex] || chosenSector;

    // Agendar a parada e abertura do pop-up
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      setSelectedSector(exactStoppedSector);

      sound.playWin();
      setStatusMessage(`🎉 Parabéns! Você ganhou: R$ 95,70`);
      setShowBonusModal(true);
    }, CAMPAIGN_CONFIG.SPIN_DURATION_MS);
  }, [isSpinning, rotation]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================
          EFEITOS DE ILUMINAÇÃO DE FUNDO (AZUL ESCURO / PROFUNDO)
         ======================================================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-blue-900/30 via-blue-950/15 to-transparent blur-[120px]" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-cyan-900/15 blur-[100px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* ========================================================
          CABEÇALHO COM ESPAÇO PARA LOGO E CONTROLES
         ======================================================== */}
      <HeaderLogo 
        soundEnabled={soundEnabled} 
        onToggleSound={handleToggleSound} 
      />

      {/* ========================================================
          CONTEÚDO PRINCIPAL (OTIMIZADO PARA MOBILE)
         ======================================================== */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3 sm:px-4 flex flex-col items-center justify-between pb-6 pt-1">
        
        {/* HEADLINE PRINCIPAL DE PRÉ-SELL */}
        <div className="w-full text-center space-y-1.5 mb-2 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-[11px] sm:text-xs font-bold text-cyan-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>ROLETA PROMOCIONAL EXCLUSIVA</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            GIRE E GANHE
          </h1>

          <p className="text-xs sm:text-sm text-slate-300/90 max-w-xs sm:max-w-sm mx-auto font-medium">
            Aperte o centro da roleta para descobrir seu prêmio especial de boas-vindas!
          </p>
        </div>

        {/* ========================================================
            AVISO TEMPORÁRIO DE "NOVO GIRO LIBERADO"
            Aparece automaticamente após a confirmação do depósito
           ======================================================== */}
        {showNewSpinBanner && (
          <div 
            id="new-spin-banner"
            className="w-full max-w-sm sm:max-w-md mx-auto mb-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] animate-[bounceIn_0.35s_ease-out] text-center"
          >
            <div className="text-sm sm:text-base font-black text-emerald-300 uppercase tracking-wide flex items-center justify-center gap-1.5">
              <span>🎉 NOVO GIRO LIBERADO!</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium mt-1 leading-snug">
              Seu primeiro depósito foi confirmado. A roleta já está disponível para você girar novamente.
            </p>
          </div>
        )}

        {/* ========================================================
            A ROLETA - PRINCIPAL ELEMENTO VISUAL DA PÁGINA
           ======================================================== */}
        <div className="w-full my-auto flex flex-col items-center justify-center">
          <RouletteWheel
            isSpinning={isSpinning}
            rotation={rotation}
            onSpinClick={handleSpin}
          />

          {/* STATUS / INSTRUÇÃO LOGO ABAIXO DA ROLETA */}
          <div className="mt-3 sm:mt-4 text-center">
            <div className={`
              inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300
              ${isSpinning 
                ? 'bg-blue-950/90 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,102,255,0.4)]' 
                : 'bg-slate-900/70 text-slate-300 border border-slate-800'
              }
            `}>
              <span className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-cyan-400 animate-ping' : 'bg-green-400'}`} />
              <span>{statusMessage}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            FEED SOCIAL / CREDIBILIDADE DE PRÉ-SELL
           ======================================================== */}
        <div className="w-full mt-4 pt-3 border-t border-blue-950/60 flex flex-col items-center gap-2.5">
          <div className="flex justify-center w-full">
            <div className="px-5 py-2.5 rounded-xl bg-slate-950/60 border border-blue-500/20 flex flex-col items-center max-w-[200px] w-full text-center">
              <Gift className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-200">100% Grátis</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400">Sem custo para girar</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-300 leading-relaxed max-w-xs">
            Promoção válida para maiores de 18 anos.
          </div>
        </div>

      </main>

      {/* ========================================================
          POP-UP DE PRÊMIO EXISTENTE ALTERADO CONFORME SOLICITADO
         ======================================================== */}
      <BonusModal
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
      />

      {/* ========================================================
          POP-UP PARA SEGUNDO RESULTADO
         ======================================================== */}
      <StandardModal
        isOpen={showStandardModal}
        sector={selectedSector}
        onClose={() => setShowStandardModal(false)}
        onSpinAgain={handleSpin}
      />

    </div>
  );
}
