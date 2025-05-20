export interface SimulatorData {
    area: number;
    enrelvamento: boolean;
    usoEficienteAgua: 'Class A' | 'Class B+' | 'Class B' | 'None';
}

export type FarmingType = 'fresh-fruit' | 'olival' | 'frutos-secos' | 'vinha';
export type SimulatorMode = 'conversion' | 'maintenance';

export interface OpenStates {
    'fresh-fruit': boolean;
    'olival': boolean;
    'frutos-secos': boolean;
    'vinha': boolean;
}

export const RATES = {
    enrelvamento: {
        conversion: 200, // euros per hectare
        maintenance: 150, // euros per hectare
    },
    usoEficienteAgua: {
        'Class A': {
            conversion: 300,
            maintenance: 250,
        },
        'Class B+': {
            conversion: 250,
            maintenance: 200,
        },
        'Class B': {
            conversion: 200,
            maintenance: 150,
        },
        'None': {
            conversion: 0,
            maintenance: 0,
        },
    },
};

export const initialData: SimulatorData = {
    area: 0,
    enrelvamento: false,
    usoEficienteAgua: 'None',
};

export const initialOpenStates: OpenStates = {
    'fresh-fruit': true,
    'olival': false,
    'frutos-secos': false,
    'vinha': false,
};

export const farmingTypes = [
    { id: 'fresh-fruit' as FarmingType, label: 'Fresh Fruit' },
    { id: 'olival' as FarmingType, label: 'Olival' },
    { id: 'frutos-secos' as FarmingType, label: 'Frutos Secos' },
    { id: 'vinha' as FarmingType, label: 'Vinha' },
] as const; 