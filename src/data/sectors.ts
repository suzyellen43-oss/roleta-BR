import { SectorItem } from '../types';

/**
 * 8 SETORES DA ROLETA:
 * 1. 30,00
 * 2. 100,00
 * 3. 50,00
 * 4. ???
 * 5. Gire de novo
 * 6. 1.000,00
 * 7. ????
 * 8. ??
 */
export const SECTORS: SectorItem[] = [
  {
    id: 1,
    index: 0,
    label: "30,00",
    displayLine1: "30,00",
    type: 'cash',
    bgColor: '#0062E6',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    isSpecialBonus: false,
  },
  {
    id: 2,
    index: 1,
    label: "95,70",
    displayLine1: "95,70",
    type: 'cash',
    bgColor: '#FFFFFF',
    textColor: '#061325',
    accentColor: '#0062E6',
    isSpecialBonus: true,
  },
  {
    id: 3,
    index: 2,
    label: "50,00",
    displayLine1: "50,00",
    type: 'cash',
    bgColor: '#0B192C',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    isSpecialBonus: false,
  },
  {
    id: 4,
    index: 3,
    label: "???",
    displayLine1: "???",
    type: 'mystery',
    bgColor: '#FFFFFF',
    textColor: '#0052CC',
    accentColor: '#0062E6',
    isSpecialBonus: true,
  },
  {
    id: 5,
    index: 4,
    label: "Gire de novo",
    displayLine1: "GIRE",
    displayLine2: "DE NOVO",
    type: 'spin_again',
    bgColor: '#0062E6',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    isSpecialBonus: false,
  },
  {
    id: 6,
    index: 5,
    label: "1.000,00",
    displayLine1: "1.000,00",
    type: 'bonus500',
    bgColor: '#FFFFFF',
    textColor: '#061325',
    accentColor: '#0062E6',
    isSpecialBonus: false,
  },
  {
    id: 7,
    index: 6,
    label: "????",
    displayLine1: "????",
    type: 'mystery',
    bgColor: '#0B192C',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    isSpecialBonus: true,
  },
  {
    id: 8,
    index: 7,
    label: "??",
    displayLine1: "??",
    type: 'mystery',
    bgColor: '#FFFFFF',
    textColor: '#0052CC',
    accentColor: '#0062E6',
    isSpecialBonus: true,
  },
];
