export type PrizeType = 
  | 'bonus500' 
  | 'cash' 
  | 'spins' 
  | 'mystery' 
  | 'spin_again' 
  | 'nothing';

export interface SectorItem {
  id: number;            // 1 to 12
  index: number;         // 0 to 11
  label: string;         // Nome original exato
  displayLine1: string;  // Primeira linha no setor
  displayLine2?: string; // Segunda linha no setor
  type: PrizeType;
  bgColor: string;       // Cor de fundo do setor
  textColor: string;     // Cor do texto
  accentColor: string;   // Cor de destaque/brilho
  isSpecialBonus: boolean; // true para "500% de bônus"
}

export interface SpinResult {
  sector: SectorItem;
  timestamp: number;
}
