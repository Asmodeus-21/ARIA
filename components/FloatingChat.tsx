import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: "Hi there! 👋 I'm Aria. I can help you automate your business. Want to see how?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState<'intro' | 'name' | 'email' | 'phone' | 'done'>('intro');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Simulate Bot Typing & Response
  const botReply = (text: string, nextStep: typeof step, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text }]);
      setStep(nextStep);
    }, delay);
  };

  // Integration with GoHighLevel
  const submitToGHL = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated success
    } catch (error) {
      console.error("GHL Submission Error", error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInputValue('');

    // Conversation Logic
    if (step === 'intro') {
      botReply("Great! To get started, what is your name?", 'name');
    } else if (step === 'name') {
      setFormData(prev => ({ ...prev, name: userText }));
      botReply(`Nice to meet you, ${userText}! What is the best email address to send you some info?`, 'email');
    } else if (step === 'email') {
      if (!userText.includes('@')) {
        botReply("Hmm, that doesn't look like a valid email. Could you try again?", 'email');
      } else {
        setFormData(prev => ({ ...prev, email: userText }));
        botReply("Perfect. Last thing - what's your phone number so we can text you the demo link?", 'phone');
      }
    } else if (step === 'phone') {
      setFormData(prev => {
        const newData = { ...prev, phone: userText };
        submitToGHL(newData);
        return newData;
      });
      botReply("Thanks! I've sent your details to our team. Someone will reach out shortly to set up your AI.", 'done');
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[40] pointer-events-none"
      style={{ touchAction: "none" }}
    >

      {/* CHAT WINDOW */}
      <div
        className={`
          mb-4 w-[350px] sm:w-[380px] bg-white/90 backdrop-blur-xl border border-white/50 
          shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}
        `}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r
