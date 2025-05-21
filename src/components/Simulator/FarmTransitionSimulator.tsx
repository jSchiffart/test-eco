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

interface FarmTransitionSimulatorProps {
    onDataChange?: () => void;
}

export const FarmTransitionSimulator = ({ onDataChange }: FarmTransitionSimulatorProps) => {
    const [openStates, setOpenStates] = useState<OpenStates>(() => {
        const savedOpenStates = localStorage.getItem('farmTransitionOpenStates');
        return savedOpenStates ? JSON.parse(savedOpenStates) : initialOpenStates;
    });

    const [simulatorMode, setSimulatorMode] = useState<SimulatorMode>(() => {
        const savedMode = localStorage.getItem('farmTransitionSimulatorMode');
        return (savedMode as SimulatorMode) || 'conversion';
    });

    const [freshFruitData, setFreshFruitData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('farmTransitionFreshFruitData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [olivalData, setOlivalData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('farmTransitionOlivalData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [frutosSecosData, setFrutosSecosData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('farmTransitionFrutosSecosData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [vinhaData, setVinhaData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('farmTransitionVinhaData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    // Save states to localStorage
    useEffect(() => {
        localStorage.setItem('farmTransitionOpenStates', JSON.stringify(openStates));
    }, [openStates]);

    useEffect(() => {
        localStorage.setItem('farmTransitionSimulatorMode', simulatorMode);
    }, [simulatorMode]);

    useEffect(() => {
        localStorage.setItem('farmTransitionFreshFruitData', JSON.stringify(freshFruitData));
    }, [freshFruitData]);

    useEffect(() => {
        localStorage.setItem('farmTransitionOlivalData', JSON.stringify(olivalData));
    }, [olivalData]);

    useEffect(() => {
        localStorage.setItem('farmTransitionFrutosSecosData', JSON.stringify(frutosSecosData));
    }, [frutosSecosData]);

    useEffect(() => {
        localStorage.setItem('farmTransitionVinhaData', JSON.stringify(vinhaData));
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
                localStorage.setItem('farmTransitionFreshFruitData', JSON.stringify(newData));
                break;
            case 'olival':
                setOlivalData(newData);
                localStorage.setItem('farmTransitionOlivalData', JSON.stringify(newData));
                break;
            case 'frutos-secos':
                setFrutosSecosData(newData);
                localStorage.setItem('farmTransitionFrutosSecosData', JSON.stringify(newData));
                break;
            case 'vinha':
                setVinhaData(newData);
                localStorage.setItem('farmTransitionVinhaData', JSON.stringify(newData));
                break;
        }
        // Trigger storage event to force data update
        window.dispatchEvent(new Event('storage'));
        onDataChange?.();
    };

    const handleReset = () => {
        setFreshFruitData(initialData);
        setOlivalData(initialData);
        setFrutosSecosData(initialData);
        setVinhaData(initialData);
        setOpenStates(initialOpenStates);
        setSimulatorMode('conversion');

        // Update localStorage directly
        localStorage.setItem('farmTransitionFreshFruitData', JSON.stringify(initialData));
        localStorage.setItem('farmTransitionOlivalData', JSON.stringify(initialData));
        localStorage.setItem('farmTransitionFrutosSecosData', JSON.stringify(initialData));
        localStorage.setItem('farmTransitionVinhaData', JSON.stringify(initialData));
        localStorage.setItem('farmTransitionOpenStates', JSON.stringify(initialOpenStates));
        localStorage.setItem('farmTransitionSimulatorMode', 'conversion');

        // Trigger storage event to force data update
        window.dispatchEvent(new Event('storage'));
        onDataChange?.();
    };

    const handleModeChange = (mode: SimulatorMode) => {
        setSimulatorMode(mode);
        localStorage.setItem('farmTransitionSimulatorMode', mode);
        // Trigger storage event to force data update
        window.dispatchEvent(new Event('storage'));
        onDataChange?.();
    };

    const toggleCard = (type: FarmingType) => {
        setOpenStates(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const calculateCardTotal = (data: SimulatorData) => {
        const area = data.area || 0;
        const enrelvamentoRate = RATES.enrelvamento[simulatorMode];
        const aguaRate = data.wateringMethod === 'irrigation'
            ? RATES.usoEficienteAgua[data.usoEficienteAgua][simulatorMode]
            : 0;

        const enrelvamentoAmount = data.enrelvamento ? area * enrelvamentoRate : 0;
        const aguaAmount = area * aguaRate;

        return enrelvamentoAmount + aguaAmount;
    };

    const calculateTotal = () => {
        const allData = [
            { data: freshFruitData, type: 'fresh-fruit' },
            { data: olivalData, type: 'olival' },
            { data: frutosSecosData, type: 'frutos-secos' },
            { data: vinhaData, type: 'vinha' },
        ];

        return allData.reduce((total, { data }) => {
            return total + calculateCardTotal(data);
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
                        onClick={() => handleModeChange('conversion')}
                        className={`h-12 text-base font-medium transition-colors ${simulatorMode === 'conversion'
                            ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                            : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                            }`}
                    >
                        Conversion
                    </Button>
                    <Button
                        variant={simulatorMode === 'maintenance' ? "default" : "outline"}
                        onClick={() => handleModeChange('maintenance')}
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
                        <div key={type.id} className="space-y-4">
                            <SimulatorCard
                                type={type.id}
                                label={type.label}
                                data={getDataForType(type.id)}
                                isOpen={openStates[type.id]}
                                simulatorMode={simulatorMode}
                                onToggle={toggleCard}
                                onDataChange={handleDataChange}
                            />
                            {getDataForType(type.id).area > 0 && (
                                <div className="text-sm font-medium text-gray-600">
                                    Subtotal: <span className="text-[#66BB6A]">{calculateCardTotal(getDataForType(type.id)).toLocaleString('pt-PT')} €</span>
                                </div>
                            )}
                        </div>
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