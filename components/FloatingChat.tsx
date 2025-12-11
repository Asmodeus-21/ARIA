
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
    console.log("Submitting to GHL:", data);
    
    // ---------------------------------------------------------
    // GHL INTEGRATION SECTION
    // ---------------------------------------------------------
    // 1. Create a "Web Hook" trigger in GoHighLevel workflows.
    // 2. Paste that URL below.
    const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID'; 

    try {
        // Uncomment to enable real submission
        /*
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                source: 'Aria Website Chatbot',
                tags: ['Chatbot Lead']
            })
        });
        */
       
       // Simulate success for demo
       await new Promise(resolve => setTimeout(resolve, 1000));
       
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
    } 
    else if (step === 'name') {
        setFormData(prev => ({ ...prev, name: userText }));
        botReply(`Nice to meet you, ${userText}! What is the best email address to send you some info?`, 'email');
    } 
    else if (step === 'email') {
        if (!userText.includes('@')) {
            botReply("Hmm, that doesn't look like a valid email. Could you try again?", 'email');
        } else {
            setFormData(prev => ({ ...prev, email: userText }));
            botReply("Perfect. Last thing - what's your phone number so we can text you the demo link?", 'phone');
        }
    } 
    else if (step === 'phone') {
        setFormData(prev => {
            const newData = { ...prev, phone: userText };
            submitToGHL(newData); // Trigger GHL Submission
            return newData;
        });
        botReply("Thanks! I've sent your details to our team. Someone will reach out shortly to set up your AI.", 'done');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Chat Window */}
      <div 
        className={`
            mb-4 w-[350px] sm:w-[380px] bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 origin-bottom-right
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Bot size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Aria Assistant</h3>
                    <p className="text-blue-100 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Online now
                    </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Messages Area */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
            {step === 'done' ? (
                <div className="text-center p-2">
                    <p className="text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                        <Sparkles size={16} /> You're all set!
                    </p>
                </div>
            ) : (
                <div className="flex gap-2 relative">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={step === 'email' ? "name@example.com" : step === 'phone' ? "(555) 000-0000" : "Type a message..."}
                        className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <Send size={16} />
                    </button>
                </div>
            )}
             <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">Powered by Aria AI</p>
            </div>
        </div>
      </div>

      {/* Floating Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
            relative group flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300
            ${isOpen ? 'bg-gray-900 rotate-90' : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:scale-110'}
        `}
      >
        {isOpen ? (
            <X size={28} className="text-white" />
        ) : (
            <>
                <MessageSquare size={28} className="text-white fill-white/20" />
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] font-bold text-white items-center justify-center border-2 border-white">1</span>
                </span>
                
                {/* Tooltip */}
                <div className={`
                    absolute right-[110%] bg-white px-4 py-2 rounded-xl shadow-xl text-gray-900 text-sm font-bold whitespace-nowrap transition-all duration-300 origin-right
                    ${isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-4 pointer-events-none'}
                `}>
                    Chat with us!
                    {/* Tiny triangle */}
                    <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white transform -translate-y-1/2 rotate-45"></div>
                </div>
            </>
        )}
      </button>

    </div>
  );
};

export default FloatingChat;
