
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';

interface ChatModalProps {
  onClose: () => void;
  initialMessage?: string;
  systemInstruction?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, initialMessage, systemInstruction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const defaultInstruction = 'You are Aria, a helpful and friendly AI receptionist assistant. Keep your responses concise and professional.';
        const defaultMessage = 'Hello! How can I assist you today?';

        const chatInstance = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: systemInstruction || defaultInstruction,
            },
        });
        setChat(chatInstance);

        setMessages([{ role: 'model', text: initialMessage || defaultMessage }]);
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
        setMessages([{ role: 'model', text: 'Sorry, I am unable to connect to the AI service right now.' }]);
    }
  }, [initialMessage, systemInstruction]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const streamResponse = await chat.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages((prev) => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of streamResponse) {
        const gcr = chunk as GenerateContentResponse;
        if(gcr.text) {
          modelResponse += gcr.text;
          setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
              return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chat]);

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-lg h-[80vh] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-white/50 ring-1 ring-black/5 animate-slide-up">
        
        {/* Premium Header */}
        <header className="p-5 border-b border-gray-100/50 flex justify-between items-center bg-white/40">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles size={20} className="text-white" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Chat with Aria</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-gray-500">Active now</span>
                </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 text-gray-500 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 p-5 overflow-y-auto bg-transparent">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in-up`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-md">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm text-sm sm:text-base leading-relaxed backdrop-blur-sm ${
                    msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                    : 'bg-white/70 border border-white/60 text-gray-800 rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                }`}>
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
             {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                 <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-md">
                        <Bot size={16} className="text-white" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white/70 border border-white/60 rounded-bl-none shadow-sm">
                        <div className="flex items-center space-x-1.5 h-3">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="p-5 bg-white/40 border-t border-gray-100/50 backdrop-blur-md">
          <div className="flex items-center gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="w-full pl-6 pr-14 py-4 bg-white/60 border border-white/50 focus:bg-white focus:border-blue-400 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatModal;
