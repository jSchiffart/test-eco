import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf } from 'lucide-react';
import { SimulatorCard } from './SimulatorCard';
import {
    FarmingType,
    SimulatorData,
    SimulatorMode,
    OpenStates,
    initialData,
    initialOpenStates,
    farmingTypes,
    RATES
} from './types';
import { FarmTransitionSimulator } from './FarmTransitionSimulator';
import { ProdisSimulator } from './ProdisSimulator';

type ProgramType = 'bio' | 'prodis';

export const Simulator = () => {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType>(() => {
        const savedProgram = localStorage.getItem('selectedProgram');
        return (savedProgram as ProgramType) || 'bio';
    });

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
                    className={`h-16 px-8 text-xl font-medium transition-colors ${selectedProgram === 'bio'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    Bio
                </Button>
                <Button
                    variant={selectedProgram === 'prodis' ? "default" : "outline"}
                    onClick={() => setSelectedProgram('prodis')}
                    className={`h-16 px-8 text-xl font-medium transition-colors ${selectedProgram === 'prodis'
                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                        }`}
                >
                    PRODIS
                </Button>
            </div>

            {selectedProgram === 'bio' ? (
                <FarmTransitionSimulator />
            ) : (
                <ProdisSimulator />
            )}
        </div>
    );
}; 