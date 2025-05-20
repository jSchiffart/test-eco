import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FarmTransitionSimulator } from './FarmTransitionSimulator';
import { ProdisSimulator } from './ProdisSimulator';
import { InfoTab } from './InfoTab';
import { SimulatorData } from './types';

type ProgramType = 'bio' | 'prodis';

export const Simulator = () => {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType>(() => {
        const savedProgram = localStorage.getItem('selectedProgram');
        return (savedProgram as ProgramType) || 'bio';
    });

    // Get simulator data from localStorage
    const getSimulatorData = (): {
        freshFruit: SimulatorData;
        olival: SimulatorData;
        frutosSecos: SimulatorData;
        vinha: SimulatorData;
    } => {
        const prefix = selectedProgram === 'bio' ? 'farmTransition' : 'prodis';
        return {
            freshFruit: JSON.parse(localStorage.getItem(`${prefix}FreshFruitData`) || '{"area": 0, "enrelvamento": false, "usoEficienteAgua": "None", "wateringMethod": "rain"}'),
            olival: JSON.parse(localStorage.getItem(`${prefix}OlivalData`) || '{"area": 0, "enrelvamento": false, "usoEficienteAgua": "None", "wateringMethod": "rain"}'),
            frutosSecos: JSON.parse(localStorage.getItem(`${prefix}FrutosSecosData`) || '{"area": 0, "enrelvamento": false, "usoEficienteAgua": "None", "wateringMethod": "rain"}'),
            vinha: JSON.parse(localStorage.getItem(`${prefix}VinhaData`) || '{"area": 0, "enrelvamento": false, "usoEficienteAgua": "None", "wateringMethod": "rain"}')
        };
    };

    useEffect(() => {
        localStorage.setItem('selectedProgram', selectedProgram);
    }, [selectedProgram]);

    const handleReset = () => {
        // Reset both simulators' data
        localStorage.removeItem('farmTransitionFreshFruitData');
        localStorage.removeItem('farmTransitionOlivalData');
        localStorage.removeItem('farmTransitionFrutosSecosData');
        localStorage.removeItem('farmTransitionVinhaData');
        localStorage.removeItem('farmTransitionOpenStates');
        localStorage.removeItem('farmTransitionSimulatorMode');

        localStorage.removeItem('prodisFreshFruitData');
        localStorage.removeItem('prodisOlivalData');
        localStorage.removeItem('prodisFrutosSecosData');
        localStorage.removeItem('prodisVinhaData');
        localStorage.removeItem('prodisOpenStates');
        localStorage.removeItem('prodisSimulatorMode');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-4">
                <Button
                    variant={selectedProgram === 'bio' ? "default" : "outline"}
                    onClick={() => setSelectedProgram('bio')}
                    className={`h-16 px-8 text-lg font-medium transition-colors ${selectedProgram === 'bio'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    Bio
                </Button>
                <Button
                    variant={selectedProgram === 'prodis' ? "default" : "outline"}
                    onClick={() => setSelectedProgram('prodis')}
                    className={`h-16 px-8 text-lg font-medium transition-colors ${selectedProgram === 'prodis'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    PRODIS
                </Button>
            </div>
            {selectedProgram === 'bio' ? <FarmTransitionSimulator /> : <ProdisSimulator />}
            <InfoTab simulatorData={getSimulatorData()} />
        </div>
    );
}; 