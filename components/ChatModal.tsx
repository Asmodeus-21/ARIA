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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
    if (!apiKey) {
      setMessages([
        {
          role: 'model',
          text: "I'm offline right now because no API key is configured."
        }
      ]);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey
      });

      const instance = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction:
            systemInstruction ||
            "You are Aria, a friendly and concise AI receptionist."
        }
      });

      setChat(instance);

      setMessages([
        {
          role: 'model',
          text: initialMessage || "Hello! How can I help you today?"
        }
      ]);
    } catch (error) {
      console.error("Gemini failed:", error);

      setMessages([
        {
          role: 'model',
          text: "Sorry, I can't connect to the AI service right now."
        }
      ]);
    }
  }, [apiKey, initialMessage, systemInstruction]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userMessage.text });

      let buffer = '';

      // Insert placeholder bot message
      setMessages(prev => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of stream) {
        const gcr = chunk as GenerateContentResponse;

        if (gcr.text) {
          buffer += gcr.text;

          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'model',
              text: buffer
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Gemini streaming error:", err);

      setMessages(prev => [
        ...prev,
        { role: 'model', text: "Something went wrong." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chat]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[20000] p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg h-[80vh] rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="p-5 border-b border-gray-200 bg-white/60 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Chat with Aria</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer touch-manipulation"
          >
            <X size={22} />
          </button>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 items-end ${
                msg.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`
                  px-5 py-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
                  ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white/80 border border-gray-200 text-gray-800 rounded-bl-none'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FIELD */}
        <footer className="p-5 border-t border-gray-200 bg-white/60">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              disabled={isLoading || !chat}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full py-3 px-5 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !chat}
              type="button"
              className="absolute right-2 p-3 bg-blue-600 text-white rounded-full cursor-pointer transition hover:bg-blue-700 disabled:opacity-50 touch-manipulation"
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
