import React from 'react';
import { Leaf } from 'lucide-react';

export const Hero = () => {
    return (
        <div className="flex flex-col items-center mb-[200px]">
            <div className="w-[300px] h-[50px] bg-[#ECF5EA] rounded-full flex items-center justify-center mb-8">
                <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-[#66BB6A]" />
                    <span className="text-[#66BB6A] font-medium">Eco-Schemes Simulator</span>
                </div>
            </div>

            <div className="text-center">
                <h1 className="text-[56px] font-bold text-black mb-4">
                    Calculate Your Transition to Sustainable Farming
                </h1>
                <p className="text-[29px] text-[#78726D] max-w-4xl mx-auto">
                    Understand the economic and environmental impacts of different eco-schemes with our interactive simulator.
                </p>
            </div>
        </div>
    );
}; 