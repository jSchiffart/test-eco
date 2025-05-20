import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TextField } from '@mui/material';
import { FarmingType, SimulatorData, SimulatorMode, WateringMethod } from './types';

interface SimulatorCardProps {
    type: FarmingType;
    label: string;
    data: SimulatorData;
    isOpen: boolean;
    simulatorMode: SimulatorMode;
    onToggle: (type: FarmingType) => void;
    onDataChange: (type: FarmingType, data: SimulatorData) => void;
}

export const SimulatorCard = ({
    type,
    label,
    data,
    isOpen,
    simulatorMode,
    onToggle,
    onDataChange,
}: SimulatorCardProps) => {
    const handleInputChange = (field: keyof SimulatorData, value: any) => {
        const newData = {
            ...data,
            [field]: value
        };

        // If switching to rain, reset usoEficienteAgua to None
        if (field === 'wateringMethod' && value === 'rain') {
            newData.usoEficienteAgua = 'None';
        }

        onDataChange(type, newData);
    };

    return (
        <div className="flex flex-col gap-4">
            <Button
                variant={isOpen ? "default" : "outline"}
                onClick={() => onToggle(type)}
                className={`w-full h-12 text-base font-medium transition-colors ${isOpen
                    ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                    : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                    }`}
            >
                {label}
            </Button>

            <Card
                className={`w-full transition-all duration-200 ${isOpen
                    ? 'opacity-100 max-h-[500px] border-[#66BB6A]'
                    : 'opacity-0 max-h-0 overflow-hidden border-[#EFF8F0]'
                    }`}
            >
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 text-left">
                        {/* Area Input */}
                        <div className="space-y-1">
                            <Label htmlFor={`area-${type}`} className="text-sm">Area (ha)</Label>
                            <TextField
                                id={`area-${type}`}
                                type="number"
                                size="small"
                                fullWidth
                                value={data.area}
                                onChange={(e) => handleInputChange('area', Math.max(0, parseFloat(e.target.value) || 0))}
                                inputProps={{ min: 0, step: 0.1 }}
                            />
                        </div>

                        {/* Enrelvamento Checkbox */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`enrelvamento-${type}`}
                                checked={data.enrelvamento}
                                onCheckedChange={(checked: boolean) => handleInputChange('enrelvamento', checked)}
                            />
                            <Label htmlFor={`enrelvamento-${type}`} className="text-sm">Cumulação do Enrelvamento</Label>
                        </div>

                        {/* Watering Method Select */}
                        <div className="space-y-1">
                            <Label htmlFor={`wateringMethod-${type}`} className="text-sm">
                                Watering Method
                            </Label>
                            <Select
                                value={data.wateringMethod}
                                onValueChange={(value: WateringMethod) => handleInputChange('wateringMethod', value)}
                            >
                                <SelectTrigger id={`wateringMethod-${type}`} className="w-full h-9 text-sm">
                                    <SelectValue placeholder="Select watering method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="irrigation">Irrigation</SelectItem>
                                    <SelectItem value="rain">Rain</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Uso Eficiente de Água Select - Only shown when watering method is irrigation */}
                        {data.wateringMethod === 'irrigation' && (
                            <div className="space-y-1">
                                <Label htmlFor={`usoEficienteAgua-${type}`} className="text-sm">
                                    {simulatorMode === 'conversion'
                                        ? 'Cumulação do Uso Eficiente de Água'
                                        : 'Cumulação do EFIAGUA'
                                    }
                                </Label>
                                <Select
                                    value={data.usoEficienteAgua}
                                    onValueChange={(value: 'Class A' | 'Class B+' | 'Class B' | 'None') =>
                                        handleInputChange('usoEficienteAgua', value)
                                    }
                                >
                                    <SelectTrigger id={`usoEficienteAgua-${type}`} className="w-full h-9 text-sm">
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Class A">Class A</SelectItem>
                                        <SelectItem value="Class B+">Class B+</SelectItem>
                                        <SelectItem value="Class B">Class B</SelectItem>
                                        <SelectItem value="None">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 