
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { brainFeatures } from '../constants';
import { 
    ShieldCheck, 
    Cpu, 
    Activity, 
    Sparkles
} from 'lucide-react';

const NeuralBrain: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);

    const getColorStyles = (color: string) => {
        const styles: Record<string, string> = {
            orange: 'border-orange-100 bg-orange-50/40 hover:border-orange-300 hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.3)] hover:bg-white',
            green: 'border-green-100 bg-green-50/40 hover:border-green-300 hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.3)] hover:bg-white',
            blue: 'border-blue-100 bg-blue-50/40 hover:border-blue-300 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] hover:bg-white',
            purple: 'border-purple-100 bg-purple-50/40 hover:border-purple-300 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3)] hover:bg-white',
            amber: 'border-amber-100 bg-amber-50/40 hover:border-amber-300 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)] hover:bg-white',
            emerald: 'border-emerald-100 bg-emerald-50/40 hover:border-emerald-300 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] hover:bg-white',
            rose: 'border-rose-100 bg-rose-50/40 hover:border-rose-300 hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.3)] hover:bg-white',
            cyan: 'border-cyan-100 bg-cyan-50/40 hover:border-cyan-300 hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.3)] hover:bg-white',
        };
        return styles[color] || styles.blue;
    };

    const getIconColor = (color: string) => {
         const styles: Record<string, string> = {
            orange: 'text-orange-600 bg-orange-100 group-hover:bg-orange-600 group-hover:text-white',
            green: 'text-green-600 bg-green-100 group-hover:bg-green-600 group-hover:text-white',
            blue: 'text-blue-600 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white',
            purple: 'text-purple-600 bg-purple-100 group-hover:bg-purple-600 group-hover:text-white',
            amber: 'text-amber-600 bg-amber-100 group-hover:bg-amber-600 group-hover:text-white',
            emerald: 'text-emerald-600 bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
            rose: 'text-rose-600 bg-rose-100 group-hover:bg-rose-600 group-hover:text-white',
            cyan: 'text-cyan-600 bg-cyan-100 group-hover:bg-cyan-600 group-hover:text-white',
        };
        return styles[color] || styles.blue;
    }

    return (
        <section ref={ref} className="py-24 sm:py-32 relative overflow-hidden z-20">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[100px] -z-10 mix-blend-multiply animate-pulse-slow"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-20 text-center sm:text-left">
                    <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Intelligence, <br/>
                        <span className="gradient-text">Redefined.</span>
                    </h2>
                    <p className="mt-6 text-xl text-gray-500 max-w-2xl leading-relaxed">
                        Aria is a hyper-scale neural engine built on the latest Gemini 3.0 Pro architecture, designed for instant, human-level reasoning.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className={`grid grid-cols-1 md:grid-cols-6 gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    
                    {/* Card 1: The Core Architecture */}
                    <div className="md:col-span-4 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 overflow-hidden group relative hover:scale-[1.01] cursor-default">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles size={12} /> Latest Generation
                                        </span>
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight">Gemini 3.0 Pro</h3>
                                    <p className="mt-2 text-gray-500 font-medium text-lg">Multimodal Native Engine</p>
                                </div>
                                <div className="p-4 bg-white/50 rounded-2xl border border-white/50 shadow-inner group-hover:bg-white transition-colors duration-500">
                                     <Cpu size={48} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-500" strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
                                        10M+
                                    </p>
                                    <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">Context Window</p>
                                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                        Perfect long-term memory.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
                                        MoE
                                    </p>
                                    <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wide">Mixture of Experts</p>
                                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                                        Expert-level accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Speed / Latency */}
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 cursor-default">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <Activity className="text-blue-400" size={32} />
                                <span className="flex h-3 w-3 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </div>
                            
                            <div className="mt-8">
                                <div className="flex items-baseline gap-1 group-hover:scale-105 transition-transform duration-300 origin-left">
                                    <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                                        &lt;100
                                    </span>
                                    <span className="text-xl font-medium text-gray-400">ms</span>
                                </div>
                                <h3 className="mt-2 text-xl font-bold">Ultra-Low Latency</h3>
                                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                                    Instant voice responses.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Enterprise Security */}
                    <div className="md:col-span-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 group hover:scale-[1.02] cursor-default">
                         <div className="h-full flex flex-col justify-between">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 ring-1 ring-green-200 shadow-lg shadow-green-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <ShieldCheck className="text-green-600 relative z-10" size={40} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">Enterprise Security</h3>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-600 shadow-sm transition-colors">SOC2 Type II</span>
                                    <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-600 shadow-sm transition-colors">Encrypted</span>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Card 4: Functional Capabilities */}
                    <div className="md:col-span-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 sm:p-12 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">Neural Capabilities</h3>
                            <p className="text-gray-500 mt-1">Real-time autonomous functions powered by the core.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {brainFeatures.slice(0, 4).map((feature, idx) => (
                                <div 
                                    key={feature.id} 
                                    className={`group relative p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer ${getColorStyles(feature.color)}`}
                                >
                                    {/* Hover Gradient Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm ${getIconColor(feature.color)}`}>
                                            {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24, className: "currentColor" })}
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-base mb-1">{feature.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">{feature.solution}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NeuralBrain;
