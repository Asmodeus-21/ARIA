
import React from 'react';
import { brandLogos } from '../constants';

const SocialProof: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-white border-y border-gray-50 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-bold text-gray-400 tracking-widest uppercase mb-12">
          Trusted by innovative teams at
        </p>
        
        <div className="relative w-full overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex animate-marquee-infinite items-center">
                {/* Double the logos for infinite loop */}
                {[...brandLogos, ...brandLogos].map((logo, index) => (
                    <div key={index} className="flex-shrink-0 mx-10 sm:mx-16 flex items-center justify-center">
                        <img 
                            src={logo.src} 
                            alt={logo.name} 
                            className="h-8 sm:h-10 w-auto object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
       <style>{`
            @keyframes marquee-infinite {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }
            .animate-marquee-infinite {
                display: flex;
                width: max-content;
                animation: marquee-infinite 60s linear infinite;
            }
            /* Pause on hover for easier viewing */
            .group:hover .animate-marquee-infinite {
                animation-play-state: paused;
            }
        `}</style>
    </section>
  );
};

export default SocialProof;
