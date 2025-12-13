
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { Play } from 'lucide-react';

interface HeroProps {
  onWatchDemo: () => void;
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onWatchDemo, onGetStarted }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex flex-col items-center pt-20 pb-20 overflow-visible">
      
      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Badge */}
          <div className="inline-block mb-8 px-5 py-2 rounded-full border border-blue-200 bg-blue-50/50 backdrop-blur-sm font-bold text-sm shadow-sm">
            <span className="gradient-text">✨ The Future of Reception is Here</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-glow drop-shadow-sm pb-4">
            <span className="gradient-text">Meet Aria</span> <span className="text-gray-900">— The World’s</span> <br /> 
            <span className="gradient-text">#1 AI Receptionist</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mt-8 max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
            Reinventing how <span className="text-gray-900 font-medium">you</span> handle calls, appointments, calendars, messages, and customers — 24/7, flawlessly.
          </p>
          
          {/* Buttons - Explicit Z-Index 50 and Pointer Events */}
          <div className="mt-12 flex flex-wrap justify-center gap-5 relative z-50">
            <button
              onClick={onGetStarted}
              className="relative z-10 cursor-pointer px-8 py-4 text-lg font-bold text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 btn-shimmer pointer-events-auto touch-manipulation"
            >
              Get Started
            </button>
            <button
              onClick={onWatchDemo}
              className="relative cursor-pointer group px-8 py-4 text-lg font-bold text-gray-700 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:bg-white transform hover:scale-105 transition-all duration-300 flex items-center gap-3 pointer-events-auto touch-manipulation"
            >
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <Play size={14} fill="currentColor" />
              </span>
              Watch Aria in Action
            </button>
          </div>

          {/* Product Visual - Hero Style */}
          <div className="mt-20 relative mx-auto max-w-6xl perspective-1000">
             {/* Glow Effect behind image */}
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 animate-pulse-slow"></div>
             
             <div className="relative rounded-[2rem] border-8 border-white/20 bg-gray-900/5 backdrop-blur-sm shadow-2xl overflow-hidden group">
                <img 
                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2370&auto=format&fit=crop" 
                    alt="Aria Dashboard Interface" 
                    className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Overlay Gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Floating Badge on Image */}
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow hidden sm:block">
                    <div className="flex items-center gap-3">
                         <div className="flex -space-x-2">
                            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="" />
                            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="" />
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">+42</div>
                         </div>
                         <div className="text-left">
                             <p className="text-xs font-bold text-gray-900">Live Calls Managed</p>
                             <p className="text-[10px] text-gray-500">Active right now</p>
                         </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
