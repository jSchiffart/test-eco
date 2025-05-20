import React from 'react';
import { Card } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => {
    return (
        <Card className="border-2 border-[#EFF8F0] hover:border-[#66BB6A] transition-colors aspect-square">
            <div className="h-full flex flex-col p-6 -mt-5 justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-7 h-7 text-[#66BB6A] flex-shrink-0" />
                    <h3 className="text-[24px] font-semibold text-black">
                        {title}
                    </h3>
                </div>
                <p className="text-[16px] text-[#78726D] leading-relaxed">
                    {description}
                </p>
            </div>
        </Card>
    );
}; 