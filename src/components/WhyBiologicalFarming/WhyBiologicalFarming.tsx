import React from 'react';
import { TrendingUp, LeafyGreen, Clock } from 'lucide-react';
import { BenefitCard } from './BenefitCard';

export const WhyBiologicalFarming = () => {
    const benefits = [
        {
            icon: TrendingUp,
            title: 'Economic Benefits',
            description: 'Reduce input costs, increase crop resilience, and potentially access premium markets for improved profitability.'
        },
        {
            icon: LeafyGreen,
            title: 'Environmental Impact',
            description: 'Improve soil health, increase biodiversity, reduce chemical runoff, and build climate resilience on your farm.'
        },
        {
            icon: Clock,
            title: 'Long-term Sustainability',
            description: 'Build a farming operation that can thrive for generations with improved natural resource management.'
        }
    ];

    return (
        <div className="mt-[100px]">
            <h2 className="text-[36px] font-bold text-center mb-[60px]">
                Why Biological Farming
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <BenefitCard
                        key={index}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                    />
                ))}
            </div>
        </div>
    );
}; 