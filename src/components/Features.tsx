
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { features } from '../constants';

const FeatureCard: React.FC<{ feature: typeof features[0], index: number }> = ({ feature, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const delay = index * 50;

    return (
        <div
            ref={ref}
            className={`relative group p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Hover Gradient Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-100/50 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                    {feature.description}
                </p>
            </div>
        </div>
    );
}

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 sm:py-32 relative scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-glow">Everything <span className="gradient-text">You</span> Need</h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                        Aria isn't just a receptionist. It's the complete front-office automation platform designed to accelerate your growth.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
