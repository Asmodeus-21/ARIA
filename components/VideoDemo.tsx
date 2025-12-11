
import React, { useRef, useState } from 'react';
import useOnScreen from '../hooks/useOnScreen';
import { PlayCircle } from 'lucide-react';

const VideoDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-glow">
                See Aria in <span className="gradient-text">Action</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Watch how Aria handles complex conversations, schedules appointments, and manages your CRM in real-time.
            </p>
        </div>

        <div
          ref={ref}
          className={`relative group rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ aspectRatio: '16/9' }}
        >
          {isPlaying ? (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/jV1vkHv4zq8?autoplay=1&rel=0&modestbranding=1"
              title="Aria Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover rounded-3xl"
            ></iframe>
          ) : (
            <>
                <div className="absolute inset-0 bg-gray-900 transition-colors">
                     <img 
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop" 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-500 transform group-hover:scale-105"
                     />
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button 
                        onClick={() => setIsPlaying(true)}
                        className="group/btn relative flex items-center justify-center"
                    >
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 duration-1000"></div>
                        <div className="relative bg-white/20 backdrop-blur-md border border-white/50 rounded-full p-6 shadow-2xl group-hover/btn:scale-110 transition-transform duration-300">
                             <PlayCircle size={64} className="text-white fill-white/20" />
                        </div>
                    </button>
                </div>
                <div className="absolute bottom-8 left-8 text-left z-10">
                    <p className="text-white font-bold text-xl drop-shadow-md">Aria Product Tour</p>
                    <p className="text-blue-100 text-sm font-medium drop-shadow-md">2:14 • 4K Resolution</p>
                </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;
