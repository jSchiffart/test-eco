import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf } from 'lucide-react';
import { SimulatorCard } from './SimulatorCard';
import {
    FarmingType,
    SimulatorData,
    OpenStates,
    initialData,
    initialOpenStates,
    farmingTypes,
    RATES
} from './types';

interface ProdisSimulatorProps {
    onDataChange?: () => void;
}

export const ProdisSimulator = ({ onDataChange }: ProdisSimulatorProps) => {
    const [openStates, setOpenStates] = useState<OpenStates>(() => {
        const savedOpenStates = localStorage.getItem('prodisOpenStates');
        return savedOpenStates ? JSON.parse(savedOpenStates) : initialOpenStates;
    });

    const [freshFruitData, setFreshFruitData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('prodisFreshFruitData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [olivalData, setOlivalData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('prodisOlivalData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [frutosSecosData, setFrutosSecosData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('prodisFrutosSecosData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    const [vinhaData, setVinhaData] = useState<SimulatorData>(() => {
        const savedData = localStorage.getItem('prodisVinhaData');
        return savedData ? JSON.parse(savedData) : initialData;
    });

    // Save states to localStorage
    useEffect(() => {
        localStorage.setItem('prodisOpenStates', JSON.stringify(openStates));
    }, [openStates]);

    useEffect(() => {
        localStorage.setItem('prodisFreshFruitData', JSON.stringify(freshFruitData));
    }, [freshFruitData]);

    useEffect(() => {
        localStorage.setItem('prodisOlivalData', JSON.stringify(olivalData));
    }, [olivalData]);

    useEffect(() => {
        localStorage.setItem('prodisFrutosSecosData', JSON.stringify(frutosSecosData));
    }, [frutosSecosData]);

    useEffect(() => {
        localStorage.setItem('prodisVinhaData', JSON.stringify(vinhaData));
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
                localStorage.setItem('prodisFreshFruitData', JSON.stringify(newData));
                break;
            case 'olival':
                setOlivalData(newData);
                localStorage.setItem('prodisOlivalData', JSON.stringify(newData));
                break;
            case 'frutos-secos':
                setFrutosSecosData(newData);
                localStorage.setItem('prodisFrutosSecosData', JSON.stringify(newData));
                break;
            case 'vinha':
                setVinhaData(newData);
                localStorage.setItem('prodisVinhaData', JSON.stringify(newData));
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

        // Update localStorage directly
        localStorage.setItem('prodisFreshFruitData', JSON.stringify(initialData));
        localStorage.setItem('prodisOlivalData', JSON.stringify(initialData));
        localStorage.setItem('prodisFrutosSecosData', JSON.stringify(initialData));
        localStorage.setItem('prodisVinhaData', JSON.stringify(initialData));
        localStorage.setItem('prodisOpenStates', JSON.stringify(initialOpenStates));

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

    const calculateCardTotal = (data: SimulatorData, type: FarmingType) => {
        const area = data.area || 0;

        // Get the base rate based on area, type, and program (always prodi for this simulator)
        const baseRate = RATES.getRate(type, area, 'prodi', data.wateringMethod);
        const baseAmount = area * baseRate;

        // Calculate ground cover amounts
        let groundCoverAmount = 0;
        if (data.groundCover) {
            // Base ground cover rate
            groundCoverAmount = area * RATES.groundCover.conversion;
        }

        // Add water efficiency if irrigation is used
        let waterEfficiencyAmount = 0;
        if (data.wateringMethod === 'irrigation' && data.waterEfficiency && data.waterEfficiency !== 'None') {
            const waterEfficiencyRates = RATES.waterEfficiency[data.waterEfficiency];
            if (waterEfficiencyRates) {
                const waterEfficiencyRate = waterEfficiencyRates.conversion;
                waterEfficiencyAmount = area * waterEfficiencyRate;
            }
        }

        return baseAmount + groundCoverAmount + waterEfficiencyAmount;
    };

    const calculateTotal = () => {
        const allData = [
            { data: freshFruitData, type: 'fresh-fruit' as FarmingType },
            { data: olivalData, type: 'olival' as FarmingType },
            { data: frutosSecosData, type: 'frutos-secos' as FarmingType },
            { data: vinhaData, type: 'vinha' as FarmingType },
        ];

        return allData.reduce((total, { data, type }) => {
            return total + calculateCardTotal(data, type);
        }, 0);
    };

    return (
        <Card className="w-full mb-8">
            <CardHeader className="bg-[#EFF8F0] flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Leaf className="w-8 h-8 text-[#227a0a]" />
                    <div>
                        <CardTitle className="text-[36px]">PRODIS Simulator</CardTitle>
                        <CardDescription className="text-[12px] text-[#78726D]">
                            Calculate the costs, returns, and environmental benefits of PRODIS program.
                        </CardDescription>
                    </div>
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
                                simulatorMode="conversion"
                                onToggle={toggleCard}
                                onDataChange={handleDataChange}
                            />
                            {getDataForType(type.id).area > 0 && (
                                <div className="text-sm font-medium text-gray-600">
                                    Subtotal in Grants: <span className="text-[#227a0a]">{calculateCardTotal(getDataForType(type.id), type.id).toLocaleString('pt-PT')} €</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                        Total: <span className="text-[#227a0a]">{calculateTotal().toLocaleString('pt-PT')} €</span>
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