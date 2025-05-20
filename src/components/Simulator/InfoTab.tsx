import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf } from 'lucide-react';
import { SimulatorData } from './types';

type TabType = 'summary' | 'financial';

interface InfoTabProps {
    simulatorData: {
        freshFruit: SimulatorData;
        olival: SimulatorData;
        frutosSecos: SimulatorData;
        vinha: SimulatorData;
    };
}

export const InfoTab = ({ simulatorData }: InfoTabProps) => {
    const [selectedTab, setSelectedTab] = useState<TabType>('summary');

    // Calculate total farm size
    const totalSize = Object.values(simulatorData).reduce((total, data) => {
        return total + (data.area || 0);
    }, 0);

    // Get active farming types (those with area > 0)
    const activeFarmingTypes = Object.entries(simulatorData)
        .filter(([_, data]) => data.area > 0)
        .map(([type, data]) => ({
            type: type.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to spaces
            area: data.area
        }));

    return (
        <Card className="w-full mb-8">
            <CardHeader className="bg-[#EFF8F0] flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Leaf className="w-8 h-8 text-[#66BB6A]" />
                    <div>
                        <CardTitle className="text-[36px]">Analysis Results</CardTitle>
                        <CardDescription className="text-[14px] text-[#78726D]">
                            Comparing conventional farming with sustainable biological methods over 3 years.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex gap-8">
                    <div className="w-[20%] space-y-6">
                        <div className="inline-flex gap-2 mb-8">
                            <Button
                                variant={selectedTab === 'summary' ? "default" : "outline"}
                                onClick={() => setSelectedTab('summary')}
                                className={`h-11 px-5 text-[15px] font-medium transition-colors ${selectedTab === 'summary'
                                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                                    }`}
                            >
                                Summary
                            </Button>
                            <Button
                                variant={selectedTab === 'financial' ? "default" : "outline"}
                                onClick={() => setSelectedTab('financial')}
                                className={`h-11 px-5 text-[15px] font-medium transition-colors ${selectedTab === 'financial'
                                        ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                                        : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                                    }`}
                            >
                                Financial
                            </Button>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Total</div>
                            <div className="text-2xl font-semibold text-[#66BB6A]">8,000 €</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Initial Investment</div>
                            <div className="text-2xl font-semibold text-[#66BB6A]">25,000 €</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Return on Investment</div>
                            <div className="text-2xl font-semibold text-[#66BB6A]">32%</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Payback Period</div>
                            <div className="text-2xl font-semibold text-[#66BB6A]">2.8 years</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Annual Profit Change</div>
                            <div className="text-2xl font-semibold text-[#66BB6A]">+15%</div>
                        </div>
                    </div>
                    <div className="w-[80%]">
                        <div className="grid grid-cols-8 grid-rows-2 gap-4 h-full">
                            <div className="col-span-8">
                                <div className="h-full p-6 border rounded-lg">
                                    <div className="text-lg font-semibold mb-4">Farm Profile</div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Total Farm Size</div>
                                            <div className="text-xl font-semibold text-[#66BB6A]">{totalSize} ha</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Transition Period</div>
                                            <div className="text-xl font-semibold text-[#66BB6A]">3 years</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Active Farming Types</div>
                                            <div className="space-y-2">
                                                {activeFarmingTypes.map((farming, index) => (
                                                    <div key={index} className="flex justify-between items-center">
                                                        <span className="text-base capitalize">{farming.type}</span>
                                                        <span className="text-base font-medium text-[#66BB6A]">{farming.area} ha</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 