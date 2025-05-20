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

export const Simulator = () => {
    const [openStates, setOpenStates] = useState<OpenStates>(initialOpenStates);
    const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>('conversion');
    const [freshFruitData, setFreshFruitData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('freshFruitData');
        return savedData ? JSON.parse(savedData) : initialData;
    });
    const [olivalData, setOlivalData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('olivalData');
        return savedData ? JSON.parse(savedData) : initialData;
    });
    const [frutosSecosData, setFrutosSecosData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('frutosSecosData');
        return savedData ? JSON.parse(savedData) : initialData;
    });
    const [vinhaData, setVinhaData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('vinhaData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('freshFruitData', JSON.stringify(freshFruitData));
    }, [freshFruitData]);

    useEffect(() => {
        localStorage.setItem('olivalData', JSON.stringify(olivalData));
    }, [olivalData]);

    useEffect(() => {
        localStorage.setItem('frutosSecosData', JSON.stringify(frutosSecosData));
    }, [frutosSecosData]);

    useEffect(() => {
        localStorage.setItem('vinhaData', JSON.stringify(vinhaData));
    }, [vinhaData]);

    const getDataForType = (type: FarmingType): SimulatorData => {
        switch (type) {
            case 'fresh-fruit':
                return freshFruitData;
            case 'olival':
                return olivalData;
            case 'frutos-secos':
                return frutosSecosData;
            case 'vinha':
                return vinhaData;
        }
    };

    const handleDataChange = (type: FarmingType, newData: SimulatorData) => {
        switch (type) {
            case 'fresh-fruit':
                setFreshFruitData(newData);
                break;
            case 'olival':
                setOlivalData(newData);
                break;
            case 'frutos-secos':
                setFrutosSecosData(newData);
                break;
            case 'vinha':
                setVinhaData(newData);
                break;
        }
    };

    const handleReset = () => {
        setFreshFruitData(initialData);
        setOlivalData(initialData);
        setFrutosSecosData(initialData);
        setVinhaData(initialData);

        localStorage.removeItem('freshFruitData');
        localStorage.removeItem('olivalData');
        localStorage.removeItem('frutosSecosData');
        localStorage.removeItem('vinhaData');
    };

    const toggleCard = (type: FarmingType) => {
        setOpenStates(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const calculateTotal = () => {
        const allData = [
            { data: freshFruitData, type: 'fresh-fruit' },
            { data: olivalData, type: 'olival' },
            { data: frutosSecosData, type: 'frutos-secos' },
            { data: vinhaData, type: 'vinha' },
        ];

        return allData.reduce((total, { data }) => {
            const area = data.area || 0;
            const enrelvamentoRate = RATES.enrelvamento[simulatorMode];
            const aguaRate = RATES.usoEficienteAgua[data.usoEficienteAgua][simulatorMode];

            const enrelvamentoAmount = data.enrelvamento ? area * enrelvamentoRate : 0;
            const aguaAmount = area * aguaRate;

            return total + enrelvamentoAmount + aguaAmount;
        }, 0);
    };

    return (
        <Card className="w-full mb-8">
            <CardHeader className="bg-[#EFF8F0] flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Leaf className="w-8 h-8 text-[#66BB6A]" />
                    <div>
                        <CardTitle className="text-[36px]">Farm Transition Simulator</CardTitle>
                        <CardDescription className="text-[12px] text-[#78726D]">
                            Calculate the costs, returns, and environmental benefits of transitioning to sustainable biological farming.
                        </CardDescription>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={simulatorMode === 'conversion' ? "default" : "outline"}
                        onClick={() => setSimulatorMode('conversion')}
                        className={`h-12 text-base font-medium transition-colors ${simulatorMode === 'conversion'
                            ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                            : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                            }`}
                    >
                        Conversion
                    </Button>
                    <Button
                        variant={simulatorMode === 'maintenance' ? "default" : "outline"}
                        onClick={() => setSimulatorMode('maintenance')}
                        className={`h-12 text-base font-medium transition-colors ${simulatorMode === 'maintenance'
                            ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                            : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                            }`}
                    >
                        Maintenance
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4">
                    {farmingTypes.map((type) => (
                        <SimulatorCard
                            key={type.id}
                            type={type.id}
                            label={type.label}
                            data={getDataForType(type.id)}
                            isOpen={openStates[type.id]}
                            simulatorMode={simulatorMode}
                            onToggle={toggleCard}
                            onDataChange={handleDataChange}
                        />
                    ))}
                </div>
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                        Total: <span className="text-[#66BB6A]">{calculateTotal().toLocaleString('pt-PT')} €</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="h-12 text-base font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors"
                    >
                        Reset Data
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}; 