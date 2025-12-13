
import React from 'react';
import { Play } from 'lucide-react';
import { zIndex } from '../constants';

interface CTAProps {
    onStartNow: () => void;
    onChatWithAria: () => void;
}

const CTA: React.FC<CTAProps> = ({ onStartNow, onChatWithAria }) => {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden bg-gray-900" style={{ zIndex: zIndex.content }}>
      
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-spin-slow bg-gradient-to-b from-transparent via-blue-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[20%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-30">
        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tighter drop-shadow-xl">
          Transform Your Business <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Today.</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100/80 leading-relaxed">
          Equip your business with Aria and automate your workflow effortlessly.
          Join 100,000+ businesses growing faster with AI.
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <button
            onClick={onStartNow}
            className="px-10 py-4 text-lg font-bold text-blue-900 bg-white rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.7)] hover:bg-gray-50 transform hover:scale-105 active:scale-95 transition-all duration-300 border border-white"
          >
            Start Now
          </button>
          <button
            onClick={onChatWithAria}
            className="px-10 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
          >
            <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
                <Play size={14} fill="currentColor" />
            </span>
            Speak with Aria
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CTA;
