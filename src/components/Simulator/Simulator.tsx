import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { FarmTransitionSimulator } from './FarmTransitionSimulator';
import { ProdisSimulator } from './ProdisSimulator';
import { InfoTab } from './InfoTab';
import { SimulatorData, initialData } from './types';

type ProgramType = 'bio' | 'prodi';

export const Simulator = () => {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType>(() => {
        const savedProgram = localStorage.getItem('selectedProgram');
        return (savedProgram as ProgramType) || 'bio';
    });
    const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(Date.now());

    // Get simulator data from localStorage
    const getSimulatorData = (): {
        bio: {
            freshFruit: SimulatorData;
            olival: SimulatorData;
            frutosSecos: SimulatorData;
            vinha: SimulatorData;
        };
        prodi: {
            freshFruit: SimulatorData;
            olival: SimulatorData;
            frutosSecos: SimulatorData;
            vinha: SimulatorData;
        };
        lastUpdate: number;
    } => {
        const getProgramData = (prefix: string) => ({
            freshFruit: JSON.parse(localStorage.getItem(`${prefix}FreshFruitData`) || JSON.stringify(initialData)),
            olival: JSON.parse(localStorage.getItem(`${prefix}OlivalData`) || JSON.stringify(initialData)),
            frutosSecos: JSON.parse(localStorage.getItem(`${prefix}FrutosSecosData`) || JSON.stringify(initialData)),
            vinha: JSON.parse(localStorage.getItem(`${prefix}VinhaData`) || JSON.stringify(initialData))
        });

        // Debug logging
        console.log('PRODI Data from localStorage:', {
            freshFruit: localStorage.getItem('prodisFreshFruitData'),
            olival: localStorage.getItem('prodisOlivalData'),
            frutosSecos: localStorage.getItem('prodisFrutosSecosData'),
            vinha: localStorage.getItem('prodisVinhaData')
        });

        return {
            bio: getProgramData('farmTransition'),
            prodi: getProgramData('prodis'),
            lastUpdate: lastUpdateTimestamp
        };
    };

    // Listen for storage changes to force updates
    useEffect(() => {
        const handleStorageChange = () => {
            setLastUpdateTimestamp(Date.now());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Update timestamp when program changes
    useEffect(() => {
        setLastUpdateTimestamp(Date.now());
    }, [selectedProgram]);

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

        localStorage.removeItem('prodiFreshFruitData');
        localStorage.removeItem('prodiOlivalData');
        localStorage.removeItem('prodiFrutosSecosData');
        localStorage.removeItem('prodiVinhaData');
        localStorage.removeItem('prodiOpenStates');
        localStorage.removeItem('prodiSimulatorMode');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-4">
                <Button
                    variant={selectedProgram === 'bio' ? "default" : "outline"}
                    onClick={() => {
                        setSelectedProgram('bio');
                        setLastUpdateTimestamp(Date.now());
                    }}
                    className={`h-16 px-8 text-lg font-medium transition-colors ${selectedProgram === 'bio'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    Bio
                </Button>
                <Button
                    variant={selectedProgram === 'prodi' ? "default" : "outline"}
                    onClick={() => {
                        setSelectedProgram('prodi');
                        setLastUpdateTimestamp(Date.now());
                    }}
                    className={`h-16 px-8 text-lg font-medium transition-colors ${selectedProgram === 'prodi'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    PRODI
                </Button>
            </div>
            {selectedProgram === 'bio' ?
                <FarmTransitionSimulator onDataChange={() => setLastUpdateTimestamp(Date.now())} /> :
                <ProdisSimulator onDataChange={() => setLastUpdateTimestamp(Date.now())} />
            }
            <InfoTab simulatorData={getSimulatorData()} />
        </div>
    );
}; 