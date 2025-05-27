import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Leaf } from 'lucide-react';
import { SimulatorData, RATES, FarmingType } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Label } from 'recharts';
import { LineChart, Line } from 'recharts';

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
    selectedProgram: 'bio' | 'prodi';
}

interface ProgramComparisonData {
    name: string;
    'Total Amount': number;
}

const COLORS = ['#227a0a', '#1a5d08', '#2d8f0d', '#3ba312'];
const PROGRAM_COLORS = {
    bio: '#227a0a',
    prodi: '#49272d'
};

const GRANT_COMPARISON_COLORS = {
    conversion: '#227a0a',
    maintenance: '#00b9a2',
    prodi: '#49272d'
};

const FARM_TYPE_COLORS = {
    'Fresh Fruit': '#227a0a',
    'Olival': '#1a5d08',
    'Frutos Secos': '#2d8f0d',
    'Vinha': '#3ba312'
};

export const InfoTab = ({ simulatorData, selectedProgram }: InfoTabProps) => {
    const [programComparisonData, setProgramComparisonData] = useState<Array<{ name: string; 'Total Amount': number }>>([]);

    // Calculate metrics for a program
    const calculateProgramMetrics = (data: { [key: string]: SimulatorData }) => {
        let totalArea = 0;
        let irrigationArea = 0;
        let groundCoverArea = 0;
        let classAArea = 0;
        let classBPlusArea = 0;
        let classBArea = 0;

        Object.values(data).forEach(farmData => {
            const area = farmData.area || 0;
            totalArea += area;

            if (farmData.wateringMethod === 'irrigation') {
                irrigationArea += area;
                switch (farmData.waterEfficiency) {
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

            if (farmData.groundCover) {
                groundCoverArea += area;
            }
        });

        return {
            totalArea,
            irrigationPercentage: totalArea ? (irrigationArea / totalArea) * 100 : 0,
            groundCoverPercentage: totalArea ? (groundCoverArea / totalArea) * 100 : 0,
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
        Object.entries(data).forEach(([type, farmData]) => {
            const area = farmData.area || 0;
            const programType = mode === 'conversion' ? 'bioConversion' : 'bioMaintenance';

            // Get the base rate based on area, type, and program
            const baseRate = RATES.getRate(type as FarmingType, area, programType, farmData.wateringMethod);
            const baseAmount = area * baseRate;

            // Calculate ground cover amounts
            let groundCoverAmount = 0;
            if (farmData.groundCover) {
                groundCoverAmount = area * RATES.groundCover[mode];
            }

            // Add water efficiency if irrigation is used
            let waterEfficiencyAmount = 0;
            if (farmData.wateringMethod === 'irrigation' && farmData.waterEfficiency && farmData.waterEfficiency !== 'None') {
                const waterEfficiencyRates = RATES.waterEfficiency[farmData.waterEfficiency];
                if (waterEfficiencyRates) {
                    const waterEfficiencyRate = waterEfficiencyRates[mode];
                    waterEfficiencyAmount = area * waterEfficiencyRate;
                }
            }

            total += baseAmount + groundCoverAmount + waterEfficiencyAmount;
        });
        return total;
    };

    // Calculate total grants based on active simulator
    const totalGrants = useMemo(() => {
        const allData = [
            { data: simulatorData[selectedProgram].freshFruit, type: 'fresh-fruit' as FarmingType },
            { data: simulatorData[selectedProgram].olival, type: 'olival' as FarmingType },
            { data: simulatorData[selectedProgram].frutosSecos, type: 'frutos-secos' as FarmingType },
            { data: simulatorData[selectedProgram].vinha, type: 'vinha' as FarmingType },
        ];

        return allData.reduce((total, { data, type }) => {
            const area = data.area || 0;
            const programType = selectedProgram === 'bio' ? 'bioConversion' : 'prodi';
            const baseRate = RATES.getRate(type, area, programType, data.wateringMethod);
            const baseAmount = area * baseRate;

            let groundCoverAmount = 0;
            if (data.groundCover) {
                groundCoverAmount = area * RATES.groundCover.conversion;
            }

            let waterEfficiencyAmount = 0;
            if (data.wateringMethod === 'irrigation' && data.waterEfficiency && data.waterEfficiency !== 'None') {
                const waterEfficiencyRates = RATES.waterEfficiency[data.waterEfficiency];
                if (waterEfficiencyRates) {
                    waterEfficiencyAmount = area * waterEfficiencyRates.conversion;
                }
            }

            return total + baseAmount + groundCoverAmount + waterEfficiencyAmount;
        }, 0);
    }, [simulatorData, selectedProgram]);

    // Add function to check if PRODI has any data
    const hasProdiData = useMemo(() => {
        return Object.values(simulatorData.prodi).some(data => data.area && data.area > 0);
    }, [simulatorData.prodi]);

    // Calculate total grants based on current program
    const totalGrantsCurrent = useMemo(() => {
        const allData = [
            { data: simulatorData.bio.freshFruit, type: 'fresh-fruit' as FarmingType },
            { data: simulatorData.bio.olival, type: 'olival' as FarmingType },
            { data: simulatorData.bio.frutosSecos, type: 'frutos-secos' as FarmingType },
            { data: simulatorData.bio.vinha, type: 'vinha' as FarmingType },
        ];

        // If there's PRODI data, calculate PRODI total
        if (hasProdiData) {
            return allData.reduce((total, { data, type }) => {
                const area = data.area || 0;
                const baseRate = RATES.getRate(type, area, 'prodi', data.wateringMethod);
                const baseAmount = area * baseRate;

                let groundCoverAmount = 0;
                if (data.groundCover) {
                    groundCoverAmount = area * RATES.groundCover.conversion;
                }

                let waterEfficiencyAmount = 0;
                if (data.wateringMethod === 'irrigation' && data.waterEfficiency && data.waterEfficiency !== 'None') {
                    const waterEfficiencyRates = RATES.waterEfficiency[data.waterEfficiency];
                    if (waterEfficiencyRates) {
                        waterEfficiencyAmount = area * waterEfficiencyRates.conversion;
                    }
                }

                return total + baseAmount + groundCoverAmount + waterEfficiencyAmount;
            }, 0);
        }

        // If there's BIO data, calculate BIO conversion total
        return allData.reduce((total, { data, type }) => {
            const area = data.area || 0;
            const baseRate = RATES.getRate(type, area, 'bioConversion', data.wateringMethod);
            const baseAmount = area * baseRate;

            let groundCoverAmount = 0;
            if (data.groundCover) {
                groundCoverAmount = area * RATES.groundCover.conversion;
            }

            let waterEfficiencyAmount = 0;
            if (data.wateringMethod === 'irrigation' && data.waterEfficiency && data.waterEfficiency !== 'None') {
                const waterEfficiencyRates = RATES.waterEfficiency[data.waterEfficiency];
                if (waterEfficiencyRates) {
                    waterEfficiencyAmount = area * waterEfficiencyRates.conversion;
                }
            }

            return total + baseAmount + groundCoverAmount + waterEfficiencyAmount;
        }, 0);
    }, [simulatorData, hasProdiData]);

    // Add function to calculate culture breakdown
    const calculateCultureBreakdown = (data: { [key: string]: SimulatorData }) => {
        return {
            freshFruit: data.freshFruit.area || 0,
            olival: data.olival.area || 0,
            frutosSecos: data.frutosSecos.area || 0,
            vinha: data.vinha.area || 0
        };
    };

    const bioBreakdown = calculateCultureBreakdown(simulatorData.bio);
    const prodiBreakdown = calculateCultureBreakdown(simulatorData.prodi);

    // Update the culture breakdown to use BIO data for PRODI when PRODI is empty
    const getCultureBreakdown = () => {
        const combined = {
            'Fresh Fruit': {
                bio: bioBreakdown.freshFruit,
                prodi: hasProdiData ? prodiBreakdown.freshFruit : bioBreakdown.freshFruit
            },
            'Olival': {
                bio: bioBreakdown.olival,
                prodi: hasProdiData ? prodiBreakdown.olival : bioBreakdown.olival
            },
            'Frutos Secos': {
                bio: bioBreakdown.frutosSecos,
                prodi: hasProdiData ? prodiBreakdown.frutosSecos : bioBreakdown.frutosSecos
            },
            'Vinha': {
                bio: bioBreakdown.vinha,
                prodi: hasProdiData ? prodiBreakdown.vinha : bioBreakdown.vinha
            }
        };

        return Object.entries(combined)
            .filter(([_, values]) => values.bio > 0 || values.prodi > 0)
            .flatMap(([name, values]) => [
                {
                    name: `${name} (BIO)`,
                    value: values.bio,
                    fill: FARM_TYPE_COLORS[name as keyof typeof FARM_TYPE_COLORS]
                },
                {
                    name: `${name} (PRODI)`,
                    value: values.prodi,
                    fill: FARM_TYPE_COLORS[name as keyof typeof FARM_TYPE_COLORS],
                    opacity: 0.6
                }
            ]);
    };

    // Update water metrics to use BIO data for PRODI when PRODI is empty
    const waterMetrics = useMemo(() => {
        const metrics = hasProdiData ? prodiMetrics : bioMetrics;
        return {
            irrigationPercentage: metrics.irrigationPercentage,
            rainPercentage: 100 - metrics.irrigationPercentage,
            waterClass: metrics.waterEfficiency.classA > 0 ? 'Class A' : metrics.waterEfficiency.classBPlus > 0 ? 'Class B+' : metrics.waterEfficiency.classB > 0 ? 'Class B' : 'N/A'
        };
    }, [hasProdiData, bioMetrics, prodiMetrics]);

    // Update program comparison data to use BIO data for PRODI when PRODI is empty
    useEffect(() => {
        // Calculate totals for all modes
        const bioConversionTotal = calculateProgramTotal(simulatorData.bio, 'conversion');
        const bioMaintenanceTotal = calculateProgramTotal(simulatorData.bio, 'maintenance');

        // Calculate PRODI total using BIO areas but with PRODI rates
        const prodiTotal = Object.entries(simulatorData.bio).reduce((total, [type, farmData]) => {
            const area = farmData.area || 0;
            const baseRate = RATES.getRate(type as FarmingType, area, 'prodi', farmData.wateringMethod);
            const baseAmount = area * baseRate;

            let groundCoverAmount = 0;
            if (farmData.groundCover) {
                groundCoverAmount = area * RATES.groundCover.conversion;
            }

            let waterEfficiencyAmount = 0;
            if (farmData.wateringMethod === 'irrigation' && farmData.waterEfficiency && farmData.waterEfficiency !== 'None') {
                const waterEfficiencyRates = RATES.waterEfficiency[farmData.waterEfficiency];
                if (waterEfficiencyRates) {
                    waterEfficiencyAmount = area * waterEfficiencyRates.conversion;
                }
            }

            return total + baseAmount + groundCoverAmount + waterEfficiencyAmount;
        }, 0);

        setProgramComparisonData([
            {
                name: 'Conv',
                'Total Amount': bioConversionTotal
            },
            {
                name: 'Main',
                'Total Amount': bioMaintenanceTotal
            },
            {
                name: 'PRODI',
                'Total Amount': prodiTotal
            }
        ]);
    }, [simulatorData.lastUpdate]);

    // Calculate CO2 emissions based on farming practices
    const calculateEmissions = useMemo(() => {
        const baseEmissions = {
            bio: {
                freshFruit: 0.8,  // tons CO2 per hectare
                olival: 0.7,
                frutosSecos: 0.6,
                vinha: 0.75
            },
            prodi: {
                freshFruit: 1.2,  // tons CO2 per hectare
                olival: 1.1,
                frutosSecos: 1.0,
                vinha: 1.15
            }
        };

        // Calculate total emissions for each program
        const calculateProgramEmissions = (data: { [key: string]: SimulatorData }, program: 'bio' | 'prodi') => {
            return Object.entries(data).reduce((total, [type, farmData]) => {
                const area = farmData.area || 0;
                const baseEmission = baseEmissions[program][type as keyof typeof baseEmissions.bio];
                let emission = area * baseEmission;

                // Reduce emissions for ground cover
                if (farmData.groundCover) {
                    emission *= 0.8; // 20% reduction
                }

                // Reduce emissions for water efficiency
                if (farmData.wateringMethod === 'irrigation' && farmData.waterEfficiency) {
                    switch (farmData.waterEfficiency) {
                        case 'Class A':
                            emission *= 0.85; // 15% reduction
                            break;
                        case 'Class B+':
                            emission *= 0.9; // 10% reduction
                            break;
                        case 'Class B':
                            emission *= 0.95; // 5% reduction
                            break;
                    }
                }

                return total + emission;
            }, 0);
        };

        return [
            {
                name: 'BIO',
                'CO2 Emissions': calculateProgramEmissions(simulatorData.bio, 'bio')
            },
            {
                name: 'PRODI',
                'CO2 Emissions': calculateProgramEmissions(simulatorData.bio, 'prodi') // Use BIO areas for comparison
            }
        ];
    }, [simulatorData.lastUpdate]);

    // Update sustainable practices data to use emissions
    const sustainablePracticesData = useMemo(() => calculateEmissions, [calculateEmissions]);

    // Update farm size data to use BIO data for PRODI when PRODI is empty
    const farmSizeData = useMemo(() => [
        {
            name: 'BIO',
            'Total Area': bioMetrics.totalArea
        },
        {
            name: 'PRODI',
            'Total Area': hasProdiData ? prodiMetrics.totalArea : bioMetrics.totalArea
        }
    ], [bioMetrics, prodiMetrics, hasProdiData]);

    const cultureBreakdown = getCultureBreakdown();
    const totalFarmSize = useMemo(() =>
        cultureBreakdown.reduce((acc, curr) => acc + curr.value, 0),
        [cultureBreakdown]
    );

    // Calculate initial investment based on total hectares
    const initialInvestment = useMemo(() =>
        totalFarmSize * 275,
        [totalFarmSize]
    );

    // Calculate ROI based on grants, initial investment, and annual profit change
    const calculateROI = useMemo(() => {
        if (initialInvestment === 0) return 0;

        // Calculate total grants over payback period (2.8 years)
        const totalGrantsOverPeriod = totalGrants * 2.8;

        // Calculate profit growth over payback period
        // Starting with initial investment and applying 15% annual growth
        const profitGrowth = initialInvestment * (Math.pow(1.15, 2.8) - 1);

        // Total return = grants + profit growth
        const totalReturn = totalGrantsOverPeriod + profitGrowth;

        // ROI = (Total Return - Initial Investment) / Initial Investment * 100
        return ((totalReturn - initialInvestment) / initialInvestment) * 100;
    }, [totalGrants, initialInvestment]);

    // Add function to calculate water usage metrics
    const calculateWaterMetrics = (data: { [key: string]: SimulatorData }) => {
        let totalArea = 0;
        let irrigationArea = 0;
        let highestWaterClass = '';

        Object.values(data).forEach(farmData => {
            const area = farmData.area || 0;
            totalArea += area;
            if (farmData.wateringMethod === 'irrigation') {
                irrigationArea += area;
                // Keep track of highest water class
                if (farmData.waterEfficiency === 'Class A' ||
                    (farmData.waterEfficiency === 'Class B+' && highestWaterClass !== 'Class A') ||
                    (farmData.waterEfficiency === 'Class B' && highestWaterClass !== 'Class A' && highestWaterClass !== 'Class B+')) {
                    highestWaterClass = farmData.waterEfficiency;
                }
            }
        });

        return {
            irrigationPercentage: totalArea ? (irrigationArea / totalArea) * 100 : 0,
            rainPercentage: totalArea ? ((totalArea - irrigationArea) / totalArea) * 100 : 0,
            waterClass: highestWaterClass
        };
    };

    const bioWaterMetrics = calculateWaterMetrics(simulatorData.bio);
    const prodiWaterMetrics = calculateWaterMetrics(simulatorData.prodi);

    // Calculate production trend data
    const calculateProductionTrends = useMemo(() => {
        // Calculate initial values
        const bioConversionTotal = calculateProgramTotal(simulatorData.bio, 'conversion');
        const bioMaintenanceTotal = calculateProgramTotal(simulatorData.bio, 'maintenance');

        // Calculate PRODI total using BIO areas but with PRODI rates
        const prodiTotal = Object.entries(simulatorData.bio).reduce((total, [type, farmData]) => {
            const area = farmData.area || 0;
            const baseRate = RATES.getRate(type as FarmingType, area, 'prodi', farmData.wateringMethod);
            const baseAmount = area * baseRate;

            let groundCoverAmount = 0;
            if (farmData.groundCover) {
                groundCoverAmount = area * RATES.groundCover.conversion;
            }

            let waterEfficiencyAmount = 0;
            if (farmData.wateringMethod === 'irrigation' && farmData.waterEfficiency && farmData.waterEfficiency !== 'None') {
                const waterEfficiencyRates = RATES.waterEfficiency[farmData.waterEfficiency];
                if (waterEfficiencyRates) {
                    waterEfficiencyAmount = area * waterEfficiencyRates.conversion;
                }
            }

            return total + baseAmount + groundCoverAmount + waterEfficiencyAmount;
        }, 0);

        // Calculate payback period (2.8 years after 3 years conversion)
        const totalPaybackYears = 4.5; // Changed from 5.8 to 4.5 years
        const displayYears = totalPaybackYears; // Removed the +1 to show exactly 4.5 years
        const intersectionYear = 2.8; // Target intersection year

        // Calculate annual rates
        const bioConversionAnnualRate = bioConversionTotal / 3; // Annual rate during conversion
        const bioMaintenanceAnnualRate = bioMaintenanceTotal; // Annual rate after conversion
        const prodiAnnualRate = prodiTotal; // Annual rate for PRODI

        // Calculate the required PRODI growth rate to intersect at 2.8 years
        // We'll solve for the multiplier that makes PRODI reach the same value as BIO at 2.8 years
        const bioValueAtIntersection = bioConversionAnnualRate * intersectionYear;
        const requiredProdiRate = bioValueAtIntersection / intersectionYear;

        // Generate data points
        const data = [];
        for (let year = 0; year <= displayYears; year += 0.1) { // Use smaller increments for smoother line
            let bioValue;
            if (year <= 3) {
                // During conversion period - show conversion grants minus initial investment
                bioValue = bioConversionAnnualRate * year - initialInvestment;
            } else {
                // After conversion period - show maintenance grants plus profit change minus initial investment
                const conversionTotal = bioConversionTotal; // Total conversion grants received
                const yearsAfterConversion = year - 3;
                const maintenanceGrants = bioMaintenanceAnnualRate * yearsAfterConversion;
                const profitChange = conversionTotal * Math.pow(1.50, yearsAfterConversion) - conversionTotal; // 50% annual profit change
                bioValue = conversionTotal + maintenanceGrants + profitChange - initialInvestment;
            }

            // PRODI grants with adjusted growth rate to intersect at 2.8 years
            const prodiValue = requiredProdiRate * year;

            data.push({
                year: year.toFixed(1),
                prodi: Math.round(prodiValue),
                bio: Math.round(bioValue)
            });
        }

        return data;
    }, [simulatorData.lastUpdate]);

    // Calculate ground cover implementation metrics
    const groundCoverMetrics = useMemo(() => {
        const totalArea = bioMetrics.totalArea;
        const groundCoverArea = bioMetrics.groundCoverPercentage * totalArea / 100;

        return {
            totalArea,
            groundCoverArea,
            percentage: bioMetrics.groundCoverPercentage,
            // Calculate implementation cost at 150€ per hectare
            implementationCost: groundCoverArea * 150
        };
    }, [bioMetrics]);

    return (
        <Card className="w-full mb-8">
            <CardHeader className="bg-[#EFF8F0] flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Leaf className="w-8 h-8 text-[#227a0a]" />
                    <div>
                        <CardTitle className="text-[36px]">Analysis Results</CardTitle>
                        <CardDescription className="text-[14px] text-[#78726D]">
                            Comparing BIO and PRODI programs across different farming practices.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex gap-[16px] h-[450px]">
                    <div className="w-[20%] flex flex-col justify-center space-y-[16px]">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Total in Grants</div>
                            <div className="text-2xl font-semibold text-[#227a0a]">{totalGrants.toLocaleString('pt-PT')} €</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Initial Investment</div>
                            <div className="text-2xl font-semibold text-[#227a0a]">{initialInvestment.toLocaleString('pt-PT')} €</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Return on Investment</div>
                            <div className="text-2xl font-semibold text-[#227a0a]">{calculateROI.toFixed(1)}%</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Payback Period</div>
                            <div className="text-2xl font-semibold text-[#227a0a]">2.8 years</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Annual Profit Change</div>
                            <div className="text-2xl font-semibold text-[#227a0a]">+50%</div>
                        </div>
                    </div>
                    <div className="w-[80%]">
                        <div className="grid grid-cols-9 grid-rows-2 gap-[16px] h-full">
                            <div className="col-span-5 col-start-1 row-span-1 pr-0">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-base font-semibold mb-4">Transition Overview</div>
                                    <div className="grid grid-cols-2 gap-[16px] h-[calc(100%-2rem)] items-center">
                                        <div className="space-y-[16px]">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Conversion Period</div>
                                                <div className="text-lg font-semibold text-[#227a0a]">
                                                    {bioMetrics.totalArea > 0 ? '3 Years' : 'Not Started'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Ground Cover Implementation</div>
                                                <div className="text-lg font-semibold text-[#227a0a]">
                                                    {groundCoverMetrics.percentage.toFixed(1)}% Coverage
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-[16px]">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Total Area in Transition</div>
                                                <div className="text-lg font-semibold text-[#227a0a]">
                                                    {bioMetrics.totalArea.toFixed(1)} ha
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-0.5">Irrigation Coverage</div>
                                                <div className="text-lg font-semibold text-[#227a0a]">
                                                    {bioMetrics.irrigationPercentage.toFixed(1)}% of Total Area
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 col-start-6 row-span-1 pl-0">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="flex h-[180px]">
                                        <div className="w-1/2 flex flex-col justify-center">
                                            <div className="text-base font-semibold mb-[5px]">Farm Summary</div>
                                            <div className="space-y-[16px]">
                                                <div>
                                                    <div className="text-xs text-gray-500">Watering Method</div>
                                                    <div className="text-sm">
                                                        <span className="text-[#227a0a]">{waterMetrics.irrigationPercentage.toFixed(1)}%</span> Irrigation
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-[#227a0a]">{waterMetrics.rainPercentage.toFixed(1)}%</span> Rain-fed
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Water Usage Class</div>
                                                    <div className="text-sm">
                                                        <span className="text-[#227a0a]">{waterMetrics.waterClass}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <div className="text-xs text-gray-500 text-center">Farm Size</div>
                                            <ResponsiveContainer width="100%" height="100%" className="-mt-1">
                                                <PieChart>
                                                    <Pie
                                                        data={cultureBreakdown}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={45}
                                                        outerRadius={65}
                                                        paddingAngle={2}
                                                    >
                                                        {cultureBreakdown.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.fill}
                                                                fillOpacity={entry.opacity || 1}
                                                            />
                                                        ))}
                                                        <Label
                                                            content={({ viewBox }) => {
                                                                const { cx, cy } = viewBox as { cx: number; cy: number };
                                                                return (
                                                                    <text
                                                                        x={cx}
                                                                        y={cy}
                                                                        textAnchor="middle"
                                                                        dominantBaseline="middle"
                                                                    >
                                                                        <tspan
                                                                            x={cx}
                                                                            y={cy}
                                                                            className="fill-[#227a0a] text-lg font-semibold"
                                                                        >
                                                                            {totalFarmSize}
                                                                        </tspan>
                                                                        <tspan
                                                                            x={cx}
                                                                            y={cy + 20}
                                                                            className="fill-gray-500 text-xs"
                                                                        >
                                                                            hectares
                                                                        </tspan>
                                                                    </text>
                                                                );
                                                            }}
                                                        />
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value: number, name: string) => [
                                                            `${value} hectares`,
                                                            name
                                                        ]}
                                                        contentStyle={{
                                                            backgroundColor: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 col-start-1 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold text-center mb-[20px]">Grant Comparison</div>
                                    <div className="h-[165px] flex justify-center">
                                        <div className="w-full">
                                            <ResponsiveContainer width="100%" height="100%" key={`program-comparison-${simulatorData.lastUpdate}`}>
                                                <BarChart
                                                    data={programComparisonData}
                                                    margin={{ top: 5, right: 5, bottom: 25, left: 5 }}
                                                >
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#78726D', fontSize: 11 }}
                                                        interval={0}
                                                        height={40}
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
                                                        formatter={(value, name) => {
                                                            const fullName = name === 'Conv' ? 'BIO: Conversion' :
                                                                name === 'Main' ? 'BIO: Maintenance' :
                                                                    'PRODI';
                                                            return [`${value.toLocaleString('en-US')} €`, fullName];
                                                        }}
                                                        contentStyle={{
                                                            backgroundColor: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="Total Amount"
                                                        fill="#227a0a"
                                                        radius={[4, 4, 0, 0]}
                                                        barSize={35}
                                                    >
                                                        {programComparisonData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.name === 'Conv' ? GRANT_COMPARISON_COLORS.conversion :
                                                                        entry.name === 'Main' ? GRANT_COMPARISON_COLORS.maintenance :
                                                                            GRANT_COMPARISON_COLORS.prodi
                                                                }
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 col-start-4 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold text-center mb-[20px]">CO2 Emissions</div>
                                    <div className="h-[165px]">
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
                                                    tickFormatter={(value) => `${value.toFixed(1)}t`}
                                                />
                                                <Tooltip
                                                    cursor={false}
                                                    formatter={(value) => [`${Number(value).toFixed(1)} tons CO2`, '']}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="CO2 Emissions"
                                                    name="CO2 Emissions"
                                                    fill={PROGRAM_COLORS.bio}
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={35}
                                                >
                                                    {sustainablePracticesData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.name === 'BIO' ? GRANT_COMPARISON_COLORS.conversion : GRANT_COMPARISON_COLORS.prodi}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-5 col-start-7 row-start-2">
                                <div className="h-[225px] p-5 border rounded-lg">
                                    <div className="text-sm font-semibold text-center mb-[20px]">Production Trends</div>
                                    <div className="h-[165px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={calculateProductionTrends}
                                                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis
                                                    dataKey="year"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                    interval="preserveStartEnd"
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fill: '#78726D', fontSize: 11 }}
                                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                                />
                                                <Tooltip
                                                    formatter={(value) => [`${value.toLocaleString('pt-PT')} €`, '']}
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Legend
                                                    verticalAlign="top"
                                                    height={36}
                                                    formatter={(value) => (
                                                        <span className="text-xs text-gray-500">{value}</span>
                                                    )}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="prodi"
                                                    name="PRODI"
                                                    stroke={PROGRAM_COLORS.prodi}
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="bio"
                                                    name="BIO"
                                                    stroke={PROGRAM_COLORS.bio}
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
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