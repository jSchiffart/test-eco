export type WateringMethod = 'irrigation' | 'rain';

export interface SimulatorData {
    area: number;
    groundCover: boolean;
    groundCoverAccumulation: boolean;
    waterEfficiency: 'Class A' | 'Class B+' | 'Class B' | 'None';
    wateringMethod: WateringType;
}

export type FarmingType = 'fresh-fruit' | 'olival' | 'frutos-secos' | 'vinha';
export type SimulatorMode = 'conversion' | 'maintenance';
export type WateringType = 'irrigation' | 'rain-fed';
export type ProgramType = 'bioConversion' | 'bioMaintenance' | 'prodi';

export interface OpenStates {
    'fresh-fruit': boolean;
    'olival': boolean;
    'frutos-secos': boolean;
    'vinha': boolean;
}

// Define the rate structure for each tier
type TierRate = {
    maxArea?: number;
    rate: number;
};

interface TierRates {
    TIER_1: TierRate;
    TIER_2: TierRate;
    TIER_3: TierRate;
    TIER_4: TierRate;
}

// Define rates for each culture and program type
interface CultureRates {
    bioConversion: TierRates;
    bioMaintenance: TierRates;
    prodi: TierRates;
}

export const RATES = {
    // Ground Cover rates
    groundCover: {
        conversion: 200, // euros per hectare
        maintenance: 150, // euros per hectare
        accumulation: {
            TIER_1: { maxArea: 10, rate: 105 },  // <= 10ha: 105€/ha
            TIER_2: { maxArea: 25, rate: 89 },   // <= 25ha: 89€/ha
            TIER_3: { maxArea: 50, rate: 79 },   // <= 50ha: 79€/ha
            TIER_4: { rate: 26 }                 // > 50ha: 26€/ha
        }
    },
    // Water efficiency rates
    waterEfficiency: {
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
    // Fresh Fruit rates (both REGADIO and SEQUEIRO)
    freshFruit: {
        irrigation: {
            bioConversion: {
                TIER_1: { maxArea: 10, rate: 975 },
                TIER_2: { maxArea: 15, rate: 780 },
                TIER_3: { maxArea: 25, rate: 488 },
                TIER_4: { rate: 195 }
            },
            bioMaintenance: {
                TIER_1: { maxArea: 10, rate: 927 },
                TIER_2: { maxArea: 15, rate: 742 },
                TIER_3: { maxArea: 25, rate: 464 },
                TIER_4: { rate: 184 }
            },
            prodi: {
                TIER_1: { maxArea: 10, rate: 552 },
                TIER_2: { maxArea: 15, rate: 442 },
                TIER_3: { maxArea: 25, rate: 276 },
                TIER_4: { rate: 110 }
            }
        },
        rainFed: {
            bioConversion: {
                TIER_1: { maxArea: 10, rate: 910 },
                TIER_2: { maxArea: 15, rate: 728 },
                TIER_3: { maxArea: 25, rate: 455 },
                TIER_4: { rate: 182 }
            },
            bioMaintenance: {
                TIER_1: { maxArea: 10, rate: 825 },
                TIER_2: { maxArea: 15, rate: 660 },
                TIER_3: { maxArea: 25, rate: 413 },
                TIER_4: { rate: 165 }
            },
            prodi: {
                TIER_1: { maxArea: 10, rate: 396 },
                TIER_2: { maxArea: 15, rate: 317 },
                TIER_3: { maxArea: 25, rate: 198 },
                TIER_4: { rate: 79 }
            }
        }
    },
    // Olival e Frutos secos rates (both REGADIO and SEQUEIRO)
    olivalFrutosSecos: {
        irrigation: {
            bioConversion: {
                TIER_1: { maxArea: 10, rate: 656 },
                TIER_2: { maxArea: 15, rate: 525 },
                TIER_3: { maxArea: 25, rate: 328 },
                TIER_4: { rate: 131 }
            },
            bioMaintenance: {
                TIER_1: { maxArea: 10, rate: 600 },
                TIER_2: { maxArea: 15, rate: 480 },
                TIER_3: { maxArea: 25, rate: 300 },
                TIER_4: { rate: 120 }
            },
            prodi: {
                TIER_1: { maxArea: 10, rate: 246 },
                TIER_2: { maxArea: 15, rate: 197 },
                TIER_3: { maxArea: 25, rate: 123 },
                TIER_4: { rate: 49 }
            }
        },
        rainFed: {
            bioConversion: {
                TIER_1: { maxArea: 10, rate: 320 },
                TIER_2: { maxArea: 15, rate: 256 },
                TIER_3: { maxArea: 25, rate: 160 },
                TIER_4: { rate: 64 }
            },
            bioMaintenance: {
                TIER_1: { maxArea: 10, rate: 290 },
                TIER_2: { maxArea: 15, rate: 232 },
                TIER_3: { maxArea: 25, rate: 145 },
                TIER_4: { rate: 58 }
            },
            prodi: {
                TIER_1: { maxArea: 10, rate: 172 },
                TIER_2: { maxArea: 15, rate: 138 },
                TIER_3: { maxArea: 25, rate: 86 },
                TIER_4: { rate: 34 }
            }
        }
    },
    // Vinha rates
    vinha: {
        bioConversion: {
            TIER_1: { maxArea: 10, rate: 630 },
            TIER_2: { maxArea: 15, rate: 504 },
            TIER_3: { maxArea: 25, rate: 315 },
            TIER_4: { rate: 126 }
        },
        bioMaintenance: {
            TIER_1: { maxArea: 10, rate: 570 },
            TIER_2: { maxArea: 15, rate: 456 },
            TIER_3: { maxArea: 25, rate: 285 },
            TIER_4: { rate: 114 }
        },
        prodi: {
            TIER_1: { maxArea: 10, rate: 236 },
            TIER_2: { maxArea: 15, rate: 189 },
            TIER_3: { maxArea: 25, rate: 118 },
            TIER_4: { rate: 47 }
        }
    },
    // Helper function to get rate based on area and program type
    getRate: (type: FarmingType, area: number, programType: ProgramType, wateringType: WateringType = 'irrigation') => {
        const getTierRate = (tiers: TierRates) => {
            if (tiers.TIER_1.maxArea !== undefined && area <= tiers.TIER_1.maxArea) return tiers.TIER_1.rate;
            if (tiers.TIER_2.maxArea !== undefined && area <= tiers.TIER_2.maxArea) return tiers.TIER_2.rate;
            if (tiers.TIER_3.maxArea !== undefined && area <= tiers.TIER_3.maxArea) return tiers.TIER_3.rate;
            return tiers.TIER_4.rate;
        };

        switch (type) {
            case 'fresh-fruit':
                const freshFruitRates = RATES.freshFruit[wateringType === 'irrigation' ? 'irrigation' : 'rainFed'];
                return getTierRate(freshFruitRates[programType]);
            case 'olival':
            case 'frutos-secos':
                const olivalFrutosSecosRates = RATES.olivalFrutosSecos[wateringType === 'irrigation' ? 'irrigation' : 'rainFed'];
                return getTierRate(olivalFrutosSecosRates[programType]);
            case 'vinha':
                return getTierRate(RATES.vinha[programType]);
            default:
                return 0;
        }
    }
};

export const initialData: SimulatorData = {
    area: 0,
    wateringMethod: 'rain-fed',
    waterEfficiency: 'None',
    groundCover: false,
    groundCoverAccumulation: false
};

export const initialOpenStates: OpenStates = {
    'fresh-fruit': false,
    'olival': false,
    'frutos-secos': false,
    'vinha': false
};

export const farmingTypes = [
    { id: 'fresh-fruit' as FarmingType, label: 'Fresh Fruit' },
    { id: 'olival' as FarmingType, label: 'Olive Grove' },
    { id: 'frutos-secos' as FarmingType, label: 'Nuts' },
    { id: 'vinha' as FarmingType, label: 'Vineyard' },
] as const; 