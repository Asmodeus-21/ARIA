
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import useCountUp from '../hooks/useCountUp';

const StatItem = ({ value, label, suffix = '', precision = 0 }: { value: number, label: string, suffix?: string, precision?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const count = useCountUp(isVisible ? value : 0, 2000);

    return (
        <div ref={ref} className="text-center group cursor-default transition-all duration-500 hover:transform hover:translate-y-[-5px]">
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-200/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <p className="relative text-5xl sm:text-7xl font-bold gradient-text tracking-tighter group-hover:scale-110 transition-transform duration-300 origin-center">
                    {count.toFixed(precision)}{suffix}
                </p>
            </div>
            <p className="mt-2 text-base text-gray-500 font-medium group-hover:text-gray-800 transition-colors">{label}</p>
        </div>
    );
};

const Stats: React.FC = () => {
    return (
        <section className="py-20 sm:py-32 bg-gray-50 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter">
                        The Impact on Your Business
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        See the tangible results you can expect, immediately.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-6">
                    <StatItem value={62} label="Increase in response rate" suffix="%" />
                    <StatItem value={3} label="Faster client booking" suffix="×" />
                    <StatItem value={70} label="Reduction in costs" suffix="%" />
                    <StatItem value={99.1} label="CRM update accuracy" suffix="%" precision={1} />
                    <StatItem value={100000} label="Businesses trust Aria" suffix="+" />
                </div>
            </div>
        </section>
    );
};

export default Stats;
