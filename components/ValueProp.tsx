
import React from 'react';
import { Briefcase, Clock, Zap } from 'lucide-react';

const ValueProp: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tighter cursor-default">
            <span className="hover:text-blue-600 transition-colors duration-300">Your Brand.</span> <span className="hover:text-green-600 transition-colors duration-300">Your Schedule.</span> <span className="gradient-text">Your Growth.</span>
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500">
            Imagine a dedicated receptionist that works around the clock specifically for you — making your calls, booking your appointments, and updating your CRM instantly.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Item 1 - Professional */}
            <div className="group relative p-8 rounded-[2rem] bg-white transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] border border-transparent hover:border-blue-100 overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative flex flex-col items-center text-center z-10">
                    <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-100 text-blue-600 mb-6 transform group-hover:rotate-6 transition-transform duration-500 shadow-sm group-hover:shadow-blue-200">
                        <Briefcase className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">Professional</h3>
                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">
                        Perfectly represents your brand on every call and message, adhering to your specific tone of voice.
                    </p>
                </div>
            </div>

            {/* Item 2 - Reliable */}
            <div className="group relative p-8 rounded-[2rem] bg-white transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] border border-transparent hover:border-green-100 overflow-hidden">
                <div className="absolute inset-0 bg-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative flex flex-col items-center text-center z-10">
                    <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-green-100 text-green-600 mb-6 transform group-hover:-rotate-6 transition-transform duration-500 shadow-sm group-hover:shadow-green-200">
                        <Clock className="h-10 w-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">Reliable</h3>
                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">
                        Always on for you, 24/7/365. No sick days, no breaks, ensuring you never miss a revenue opportunity.
                    </p>
                </div>
            </div>

            {/* Item 3 - Limitless */}
            <div className="group relative p-8 rounded-[2rem] bg-white transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.25)] border border-transparent hover:border-purple-200 overflow-hidden">
                {/* Dynamic Background for Limitless Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                
                <div className="relative flex flex-col items-center text-center z-10">
                    <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-purple-100 text-purple-600 mb-6 shadow-sm group-hover:shadow-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                        {/* Spin animation on hover for 'Limitless' feeling */}
                        <Zap className="h-10 w-10 group-hover:animate-[spin_3s_linear_infinite]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">Limitless</h3>
                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-700">
                        Scales instantly to handle 1 call or 10,000 concurrent calls without a single second of wait time.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
