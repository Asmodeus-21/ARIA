import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import type { ChatMessage } from '../types';

interface Props {
  onClose: () => void;
  initialMessage?: string;
  systemInstruction?: string;
}

const ChatModal: React.FC<Props> = ({
  onClose,
  initialMessage,
  systemInstruction
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const chatInstance = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction:
            systemInstruction ||
            'You are Aria, a friendly but concise AI receptionist.'
        }
      });

      setChat(chatInstance);

      setMessages([
        {
          role: 'model',
          text: initialMessage || 'Hello! How can I help you today?'
        }
      ]);
    } catch (err) {
      console.error('Gemini init failed:', err);
      setMessages([
        {
          role: 'model',
          text: 'Sorry, I cannot connect to the AI service right now.'
        }
      ]);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userMsg.text });

      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of stream) {
        const gcr = chunk as GenerateContentResponse;
        if (gcr.text) {
          modelResponse += gcr.text;

          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'model',
              text: modelResponse
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: 'Something went wrong.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chat]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[20000] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg h-[80vh] rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="p-5 border-b border-gray-200 bg-white/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            Chat with Aria
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-3 ${
                msg.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`px-5 py-3.5 rounded-2xl max-w-[80%] leading-relaxed text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <footer className="p-5 border-t border-gray-200 bg-white/50">
          <div className="relative flex items-center gap-2">
            <input
              className="w-full py-3 px-5 bg-white/70 border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition"
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
