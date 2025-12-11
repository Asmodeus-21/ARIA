import { useEffect } from "react";
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProp from './components/ValueProp';
import Features from './components/Features';
import Stats from './components/Stats';
import SocialProof from './components/SocialProof';
import HowItWorks from './components/HowItWorks';
import NeuralBrain from './components/NeuralBrain';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ChatModal from './components/ChatModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import FloatingChat from './components/FloatingChat';

interface ChatConfig {
  isOpen: boolean;
  initialMessage?: string;
  systemInstruction?: string;
}

interface VoiceConfig {
  isOpen: boolean;
  autoStart?: boolean;
  systemInstruction?: string;
  initialMessage?: string;
}

const App: React.FC = () => {
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig | null>(null);
  const [isLeadFormOpen, setLeadFormOpen] = useState(false);

  // ⬇️⬇️ FORM HOOK ADDED HERE
  useEffect(() => {
    const watcher = setInterval(() => {
      const first = document.querySelector('input[placeholder="First Name"]') as HTMLInputElement | null;
      const last = document.querySelector('input[placeholder="Last Name"]') as HTMLInputElement | null;
      const email = document.querySelector('input[placeholder="Email Address"]') as HTMLInputElement | null;
      const phone = document.querySelector('input[placeholder="Phone Number"]') as HTMLInputElement | null;
      const btn = document.querySelector('button[type="submit"], button') as HTMLButtonElement | null;

      if (first && last && email && phone && btn && !btn.dataset.bound) {
        btn.dataset.bound = "1";

        btn.addEventListener("click", async (e) => {
          e.preventDefault();

          const payload = {
            firstName: first.value,
            lastName: last.value,
            email: email.value,
            phone: phone.value,
            message: "Popup form submission",
            source: "Website",
            tags: ["website", "popup"],
            pageUrl: window.location.href,
          };

          const res = await fetch("/api/ghl-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          console.log("Form submitted →", data);
        });

        console.log("Lead form watcher connected.");
      }
    }, 300);

    return () => clearInterval(watcher);
  }, []);
  // ⬆️⬆️ FORM HOOK ENDS HERE

  const handleWatchDemo = () => {
    setVoiceConfig({
      isOpen: true,
      autoStart: true,
      initialMessage: "Hi there! I'm Aria, your AI receptionist. I can help manage your calls and schedule. How can I help you today?",
      systemInstruction: "You are Aria..."
    });
  };

  const handleChatWithAria = () => {
    handleWatchDemo();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Header onGetStarted={() => setLeadFormOpen(true)} />

      <main className="relative z-10 pt-20">
        <Hero onWatchDemo={handleWatchDemo} onGetStarted={() => setLeadFormOpen(true)} />
        <ValueProp />
        <Features />
        <Stats />
        <SocialProof />
        <HowItWorks />
        <NeuralBrain />
        <Testimonials />
        <Pricing onGetStarted={() => setLeadFormOpen(true)} />
        <CTA 
          onStartNow={() => setLeadFormOpen(true)}
          onChatWithAria={handleChatWithAria}
        />
      </main>

      <Footer />

      {chatConfig?.isOpen && (
        <ChatModal 
          onClose={() => setChatConfig(null)} 
          initialMessage={chatConfig.initialMessage}
          systemInstruction={chatConfig.systemInstruction}
        />
      )}

      {voiceConfig?.isOpen && (
        <VoiceAssistantModal 
          onClose={() => setVoiceConfig(null)} 
          autoStart={voiceConfig.autoStart}
          systemInstruction={voiceConfig.systemInstruction}
          initialMessage={voiceConfig.initialMessage}
        />
      )}

      {isLeadFormOpen && <LeadCaptureModal onClose={() => setLeadFormOpen(false)} />}

      <FloatingChat />
    </div>
  );
};

export default App;
