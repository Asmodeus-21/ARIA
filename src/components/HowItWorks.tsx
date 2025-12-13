
import React, { useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { ClipboardList, Cable, Rocket } from 'lucide-react';

const Step = ({ icon, title, description, index }: { icon: React.ReactNode, title: string, description: string, index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    return (
        <div ref={ref} className={`relative flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
            {/* Connector Line for Desktop */}
            {index < 3 && (
                 <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gray-100 -z-10 transform translate-x-12 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-blue-400 to-indigo-500 origin-left animate-slide-right opacity-30"></div>
                 </div>
            )}
            
            {/* Glossy Icon Container */}
            <div className="relative group cursor-default">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center h-24 w-24 rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-white/80 ring-1 ring-blue-50 backdrop-blur-xl group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-transparent pointer-events-none"></div>
                    {icon}
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white text-sm group-hover:scale-110 transition-transform">
                    {index}
                </div>
            </div>

            <h3 className="mt-8 text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="mt-3 text-gray-500 text-center leading-relaxed max-w-xs">{description}</p>
        </div>
    );
}

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <style>{`
        @keyframes slide-right {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-slide-right {
            animation: slide-right 2s linear infinite;
        }
      `}</style>
      
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl mix-blend-multiply -z-10 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl mix-blend-multiply -z-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-glow">
            We Handle Everything. <br />
            <span className="gradient-text">You Just Go Live.</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Forget complex setups. Our expert team builds, configures, and deploys your custom AI receptionist for you.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 max-w-6xl mx-auto">
            <Step 
                index={1} 
                icon={<ClipboardList size={40} className="text-blue-600 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />} 
                title="We Analyze Your Needs" 
                description="We consult with you to understand your specific workflows, preferences, and business goals." 
            />
            <Step 
                index={2} 
                icon={<Cable size={40} className="text-purple-600 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />} 
                title="We Integrate Everything" 
                description="Our engineers connect Aria to your existing CRM, calendar, and phone lines seamlessly." 
            />
            <Step 
                index={3} 
                icon={<Rocket size={40} className="text-indigo-600 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />} 
                title="Your AI Launches Instantly" 
                description="Sit back as we flip the switch. Aria starts handling your calls and scaling your business immediately." 
            />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
