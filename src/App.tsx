import React, { useState } from 'react';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ValueProp from '@/components/ValueProp';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import SocialProof from '@/components/SocialProof';
import HowItWorks from '@/components/HowItWorks';
import NeuralBrain from '@/components/NeuralBrain';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

import ChatModal from '@/components/ChatModal';
import VoiceAssistantModal from '@/components/VoiceAssistantModal';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import FloatingChat from '@/components/FloatingChat';

const App: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showLead, setShowLead] = useState(false);

  const openVoice = () => {
    setShowVoice(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Background Blobs */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Header onGetStarted={() => setShowLead(true)} />

      <main className="relative z-10 pt-20">
        <Hero 
          onWatchDemo={openVoice}
          onGetStarted={() => setShowLead(true)}
        />

        <ValueProp />
        <Features />
        <Stats />
        <SocialProof />
        <HowItWorks />
        <NeuralBrain />
        <Testimonials />
        <Pricing onGetStarted={() => setShowLead(true)} />

        <CTA
          onStartNow={() => setShowLead(true)}
          onChatWithAria={() => setShowChat(true)}
        />
      </main>

      <Footer />

      {/* MODALS */}
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showVoice && <VoiceAssistantModal onClose={() => setShowVoice(false)} />}
      {showLead && <LeadCaptureModal onClose={() => setShowLead(false)} />}

      <FloatingChat />
    </div>
  );
};

export default App;
