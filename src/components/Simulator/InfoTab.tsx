import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf } from 'lucide-react';
import { SimulatorData, RATES } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

type TabType = 'summary' | 'financial';

interface InfoTabProps {
    simulatorData: {
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
    };
}

const COLORS = ['#66BB6A', '#4CAF50', '#81C784', '#A5D6A7'];
const PROGRAM_COLORS = {
    bio: '#66BB6A',
    prodi: '#4CAF50'
};

export const InfoTab = ({ simulatorData }: InfoTabProps) => {
    const [selectedTab, setSelectedTab] = useState<TabType>('summary');
    const [programComparisonData, setProgramComparisonData] = useState<Array<{ name: string; 'Total Amount': number }>>([]);

    // Calculate metrics for a program
    const calculateProgramMetrics = (data: { [key: string]: SimulatorData }) => {
        let totalArea = 0;
        let irrigationArea = 0;
        let enrelvamentoArea = 0;
        let classAArea = 0;
        let classBPlusArea = 0;
        let classBArea = 0;

        Object.values(data).forEach(farmData => {
            const area = farmData.area || 0;
            totalArea += area;

            if (farmData.wateringMethod === 'irrigation') {
                irrigationArea += area;
                switch (farmData.usoEficienteAgua) {
                    case 'Class A':
                        classAArea += area;
                        break;
                    case 'Class B+':
                        classBPlusArea += area;
                        break;
                    case 'Class B':
                        classBArea += area;
                        break;
                }
            }

            if (farmData.enrelvamento) {
                enrelvamentoArea += area;
            }
        });

        return {
            totalArea,
            irrigationPercentage: totalArea ? (irrigationArea / totalArea) * 100 : 0,
            enrelvamentoPercentage: totalArea ? (enrelvamentoArea / totalArea) * 100 : 0,
            waterEfficiency: {
                classA: irrigationArea ? (classAArea / irrigationArea) * 100 : 0,
                classBPlus: irrigationArea ? (classBPlusArea / irrigationArea) * 100 : 0,
                classB: irrigationArea ? (classBArea / irrigationArea) * 100 : 0
            }
        };
    };

    const bioMetrics = calculateProgramMetrics(simulatorData.bio);
    const prodiMetrics = calculateProgramMetrics(simulatorData.prodi);

    // Calculate total amounts for a program with specific mode
    const calculateProgramTotal = (data: { [key: string]: SimulatorData }, mode: 'conversion' | 'maintenance') => {
        let total = 0;
        Object.values(data).forEach(farmData => {
            const area = farmData.area || 0;
            const enrelvamentoRate = RATES.enrelvamento[mode];
            const aguaRate = farmData.wateringMethod === 'irrigation'
                ? RATES.usoEficienteAgua[farmData.usoEficienteAgua][mode]
                : 0;

            const enrelvamentoAmount = farmData.enrelvamento ? area * enrelvamentoRate : 0;
            const aguaAmount = area * aguaRate;

            total += enrelvamentoAmount + aguaAmount;
        });
        return total;
    };

    // Update graph data when simulator data changes
    useEffect(() => {
        // Calculate totals for all modes
        const bioConversionTotal = calculateProgramTotal(simulatorData.bio, 'conversion');
        const bioMaintenanceTotal = calculateProgramTotal(simulatorData.bio, 'maintenance');
        const prodiTotal = calculateProgramTotal(simulatorData.prodi, 'conversion');

        setProgramComparisonData([
            {
                name: 'BIO Conversion',
                'Total Amount': bioConversionTotal
            },
            {
                name: 'BIO Maintenance',
                'Total Amount': bioMaintenanceTotal
            },
            {
                name: 'PRODI',
                'Total Amount': prodiTotal
            }
        ]);
    }, [simulatorData.lastUpdate]); // Only depend on the timestamp

    // Prepare data for comparative charts
    const sustainablePracticesData = [
        {
            name: 'BIO',
            'Enrelvamento Coverage': bioMetrics.enrelvamentoPercentage
        },
        {
            name: 'PRODI',
            'Enrelvamento Coverage': prodiMetrics.enrelvamentoPercentage
        }
    ];

    const farmSizeData = [
        {
            name: 'BIO',
            'Total Area': bioMetrics.totalArea
        },
        {
            name: 'PRODI',
            'Total Area': prodiMetrics.totalArea
        }
    ];

    return (
        <Card className="w-full mb-8">
            <CardHeader className="bg-[#EFF8F0] flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Leaf className="w-8 h-8 text-[#66BB6A]" />
                    <div>
                        <CardTitle className="text-[36px]">Analysis Results</CardTitle>
                        <CardDescription className="text-[14px] text-[#78726D]">
                            Comparing BIO and PRODI programs across different farming practices.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex gap-8">
                    <div className="w-[20%] space-y-6">
                        <div className="inline-flex gap-2">
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
                        <div className="grid grid-cols-9 grid-rows-2 gap-4 h-full">
                            <div className="col-span-5 col-start-1 row-span-1">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-base font-semibold mb-3">Transition Overview</div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Current Status</div>
                                            <div className="text-lg font-semibold text-[#66BB6A]">In Progress</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Next Milestone</div>
                                            <div className="text-lg font-semibold text-[#66BB6A]">Year 2 Certification</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Completion Target</div>
                                            <div className="text-lg font-semibold text-[#66BB6A]">Q4 2024</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 col-start-6 row-span-1">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-base font-semibold mb-3">Farm Profile</div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Total Farm Size</div>
                                            <div className="text-lg font-semibold text-[#66BB6A]">{bioMetrics.totalArea + prodiMetrics.totalArea} ha</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">Transition Period</div>
                                            <div className="text-lg font-semibold text-[#66BB6A]">3 years</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 col-start-1 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold mb-2">Program Comparison</div>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%" key={`program-comparison-${simulatorData.lastUpdate}`}>
                                            <BarChart
                                                data={programComparisonData}
                                                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                            >
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                                    domain={[0, 'auto']}
                                                />
                                                <Tooltip
                                                    cursor={false}
                                                    formatter={(value) => [`${value.toLocaleString('pt-PT')} €`, '']}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="Total Amount"
                                                    fill={PROGRAM_COLORS.bio}
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={35}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 col-start-4 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold mb-2">Sustainable Practices</div>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%" key={`sustainable-practices-${simulatorData.lastUpdate}`}>
                                            <BarChart
                                                data={sustainablePracticesData}
                                                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                />
                                                <Tooltip
                                                    cursor={false}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="Enrelvamento Coverage"
                                                    name="Enrelvamento Coverage %"
                                                    fill={PROGRAM_COLORS.bio}
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={35}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 col-start-7 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold mb-2">Farm Size Distribution</div>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%" key={`farm-size-${simulatorData.lastUpdate}`}>
                                            <BarChart
                                                data={farmSizeData}
                                                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                />
                                                <Tooltip
                                                    cursor={false}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="Total Area"
                                                    name="Total Area (ha)"
                                                    fill={PROGRAM_COLORS.bio}
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={35}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
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