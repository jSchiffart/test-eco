import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Paper, Box } from '@mui/material';
import { Leaf, TrendingUp, LeafyGreen, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';
import './App.css';

interface SimulatorData {
  area: number;
  enrelvamento: boolean;
  usoEficienteAgua: 'Class A' | 'Class B+' | 'Class B' | 'None';
}

type FarmingType = 'fresh-fruit' | 'olival' | 'frutos-secos' | 'vinha';

interface OpenStates {
  'fresh-fruit': boolean;
  'olival': boolean;
  'frutos-secos': boolean;
  'vinha': boolean;
}

function App() {
  const initialData: SimulatorData = {
    area: 0.5,
    enrelvamento: false,
    usoEficienteAgua: 'None',
  };

  const initialOpenStates: OpenStates = {
    'fresh-fruit': false,
    'olival': false,
    'frutos-secos': false,
    'vinha': false,
  };

  const [openStates, setOpenStates] = useState<OpenStates>(initialOpenStates);
  const [selectedType, setSelectedType] = useState<FarmingType>('fresh-fruit');
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

  const getCurrentData = () => {
    switch (selectedType) {
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

  const getCurrentDataSetter = () => {
    switch (selectedType) {
      case 'fresh-fruit':
        return setFreshFruitData;
      case 'olival':
        return setOlivalData;
      case 'frutos-secos':
        return setFrutosSecosData;
      case 'vinha':
        return setVinhaData;
    }
  };

  const handleInputChange = (field: keyof SimulatorData, value: any) => {
    const setData = getCurrentDataSetter();
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    const setData = getCurrentDataSetter();
    setData(initialData);
    localStorage.removeItem(`${selectedType}Data`);
  };

  const toggleCard = (type: FarmingType) => {
    setOpenStates(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderSimulator = () => {
    const data = getCurrentData();

    return (
      <div className="grid grid-cols-1 gap-4 mt-4">
        <Paper elevation={3} sx={{ p: 3 }}>
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto text-left">
            {/* Area Input */}
            <div className="space-y-2">
              <Label htmlFor="area">Area (ha)</Label>
              <TextField
                id="area"
                type="number"
                fullWidth
                value={data.area}
                onChange={(e) => handleInputChange('area', Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                inputProps={{ min: 0.5, step: 0.1 }}
              />
            </div>

            {/* Enrelvamento Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enrelvamento"
                checked={data.enrelvamento}
                onCheckedChange={(checked: boolean) => handleInputChange('enrelvamento', checked)}
              />
              <Label htmlFor="enrelvamento">Cumulação do Enrelvamento</Label>
            </div>

            {/* Uso Eficiente de Água Select */}
            <div className="space-y-2">
              <Label htmlFor="usoEficienteAgua">Cumulação do Uso Eficiente de Água</Label>
              <Select
                value={data.usoEficienteAgua}
                onValueChange={(value: 'Class A' | 'Class B+' | 'Class B' | 'None') => handleInputChange('usoEficienteAgua', value)}
              >
                <SelectTrigger id="usoEficienteAgua" className="w-full">
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
          </div>
        </Paper>
      </div>
    );
  };

  const farmingTypes = [
    { id: 'fresh-fruit', label: 'Fresh Fruit' },
    { id: 'olival', label: 'Olival' },
    { id: 'frutos-secos', label: 'Frutos Secos' },
    { id: 'vinha', label: 'Vinha' },
  ] as const;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <div className="flex flex-col items-center mb-[200px]">
        <div className="w-[300px] h-[50px] bg-[#ECF5EA] rounded-full flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#66BB6A]" />
            <span className="text-[#66BB6A] font-medium">Biological Farming Calculator</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-[56px] font-bold text-black mb-4">
            Calculate Your Transition to Sustainable Farming
          </h1>
          <p className="text-[29px] text-[#78726D] max-w-4xl mx-auto">
            Understand the economic and environmental impacts of shifting from conventional to biological farming with our interactive calculator.
          </p>
        </div>
      </div>

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
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-12 text-base font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors"
          >
            Reset Data
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            {farmingTypes.map((type) => {
              const typeData = type.id === 'fresh-fruit' ? freshFruitData :
                type.id === 'olival' ? olivalData :
                  type.id === 'frutos-secos' ? frutosSecosData :
                    vinhaData;

              return (
                <div key={type.id} className="flex flex-col gap-4">
                  <Button
                    variant={openStates[type.id] ? "default" : "outline"}
                    onClick={() => toggleCard(type.id)}
                    className={`w-full h-12 text-base font-medium transition-colors ${openStates[type.id]
                      ? 'bg-[#66BB6A] text-white hover:bg-[#4CAF50]'
                      : 'hover:bg-[#EFF8F0] hover:text-[#66BB6A] hover:border-[#66BB6A]'
                      }`}
                  >
                    {type.label}
                  </Button>

                  <Card
                    className={`w-full transition-all duration-200 ${openStates[type.id]
                      ? 'opacity-100 max-h-[500px] border-[#66BB6A]'
                      : 'opacity-0 max-h-0 overflow-hidden border-[#EFF8F0]'
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 gap-4 text-left">
                        {/* Area Input */}
                        <div className="space-y-1">
                          <Label htmlFor={`area-${type.id}`} className="text-sm">Area (ha)</Label>
                          <TextField
                            id={`area-${type.id}`}
                            type="number"
                            size="small"
                            fullWidth
                            value={typeData.area}
                            onChange={(e) => {
                              const setData = type.id === 'fresh-fruit' ? setFreshFruitData :
                                type.id === 'olival' ? setOlivalData :
                                  type.id === 'frutos-secos' ? setFrutosSecosData :
                                    setVinhaData;
                              setData(prev => ({
                                ...prev,
                                area: Math.max(0.5, parseFloat(e.target.value) || 0.5)
                              }));
                            }}
                            inputProps={{ min: 0.5, step: 0.1 }}
                          />
                        </div>

                        {/* Enrelvamento Checkbox */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`enrelvamento-${type.id}`}
                            checked={typeData.enrelvamento}
                            onCheckedChange={(checked: boolean) => {
                              const setData = type.id === 'fresh-fruit' ? setFreshFruitData :
                                type.id === 'olival' ? setOlivalData :
                                  type.id === 'frutos-secos' ? setFrutosSecosData :
                                    setVinhaData;
                              setData(prev => ({
                                ...prev,
                                enrelvamento: checked
                              }));
                            }}
                          />
                          <Label htmlFor={`enrelvamento-${type.id}`} className="text-sm">Cumulação do Enrelvamento</Label>
                        </div>

                        {/* Uso Eficiente de Água Select */}
                        <div className="space-y-1">
                          <Label htmlFor={`usoEficienteAgua-${type.id}`} className="text-sm">Cumulação do Uso Eficiente de Água</Label>
                          <Select
                            value={typeData.usoEficienteAgua}
                            onValueChange={(value: 'Class A' | 'Class B+' | 'Class B' | 'None') => {
                              const setData = type.id === 'fresh-fruit' ? setFreshFruitData :
                                type.id === 'olival' ? setOlivalData :
                                  type.id === 'frutos-secos' ? setFrutosSecosData :
                                    setVinhaData;
                              setData(prev => ({
                                ...prev,
                                usoEficienteAgua: value
                              }));
                            }}
                          >
                            <SelectTrigger id={`usoEficienteAgua-${type.id}`} className="w-full h-9 text-sm">
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
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-[100px] mb-[50px]">
        <h2 className="text-[36px] font-bold text-center mb-[60px]">
          Why Biological Farming
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Economic Benefits Card */}
          <Card className="border-2 border-[#EFF8F0] hover:border-[#66BB6A] transition-colors aspect-square">
            <div className="h-full flex flex-col p-6 -mt-5 justify-center">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-7 h-7 text-[#66BB6A] flex-shrink-0" />
                <h3 className="text-[24px] font-semibold text-black">
                  Economic Benefits
                </h3>
              </div>
              <p className="text-[16px] text-[#78726D] leading-relaxed">
                Reduce input costs, increase crop resilience, and potentially access premium markets for improved profitability.
              </p>
            </div>
          </Card>

          {/* Environmental Impact Card */}
          <Card className="border-2 border-[#EFF8F0] hover:border-[#66BB6A] transition-colors aspect-square">
            <div className="h-full flex flex-col p-6 -mt-5 justify-center">
              <div className="flex items-center gap-3 mb-4">
                <LeafyGreen className="w-7 h-7 text-[#66BB6A] flex-shrink-0" />
                <h3 className="text-[24px] font-semibold text-black">
                  Environmental Impact
                </h3>
              </div>
              <p className="text-[16px] text-[#78726D] leading-relaxed">
                Improve soil health, increase biodiversity, reduce chemical runoff, and build climate resilience on your farm.
              </p>
            </div>
          </Card>

          {/* Long-term Sustainability Card */}
          <Card className="border-2 border-[#EFF8F0] hover:border-[#66BB6A] transition-colors aspect-square">
            <div className="h-full flex flex-col p-6 -mt-5 justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-7 h-7 text-[#66BB6A] flex-shrink-0" />
                <h3 className="text-[24px] font-semibold text-black">
                  Long-term Sustainability
                </h3>
              </div>
              <p className="text-[16px] text-[#78726D] leading-relaxed">
                Build a farming operation that can thrive for generations with improved natural resource management.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <footer className="mt-[100px] py-8 bg-[#8D6E63]/10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-[14px] text-[#78726D] text-center leading-relaxed">
            This calculator provides estimates based on general research and assumptions. Results may vary based on specific farm conditions, practices, markets, and environmental factors.
          </p>
        </div>
      </footer>
    </Container>
  );
}

export default App;
