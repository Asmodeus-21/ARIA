import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

// Lightweight phone validation to avoid extra dependencies: accept 7–15 digits after stripping formatting.
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;
const PHONE_DIGIT_PATTERN = new RegExp(`^\\d{${MIN_PHONE_DIGITS},${MAX_PHONE_DIGITS}}$`);
const RETRY_DELAY_MS = 400;

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Hi there! 👋 I'm Aria. I can help you automate your business. Want to see how?",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState<
    "intro" | "name" | "email" | "phone" | "done"
  >("intro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const botReply = (
    text: string,
    nextStep: typeof step,
    delay = 700
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now(), role: "bot", text }]);
      setStep(nextStep);
    }, delay);
  };

  const submitToGHL = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const resp = await fetch("/api/ghl-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "Floating Chat",
          tags: ["FloatingChat"],
        }),
      });
      if (!resp.ok) {
        console.error("Failed to submit lead:", resp.status, resp.statusText);
        setError(`Lead submission failed (${resp.status}). Please try again.`);
        setIsSubmitting(false);
        return false;
      }
      setIsSubmitting(false);
      return true;
    } catch (err) {
      console.error("Lead capture failed:", err);
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
      return false;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setError(null);

    const userText = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: userText },
    ]);
    setInputValue("");

    if (step === "intro") {
      botReply("Great! To get started, what is your name?", "name");
    } else if (step === "name") {
      setFormData((prev) => ({ ...prev, name: userText }));
      botReply(`Nice to meet you, ${userText}! What's the best email for info?`, "email");
    } else if (step === "email") {
      if (!userText.includes("@")) {
        botReply("That doesn’t look like a valid email. Try again?", "email");
      } else {
        setFormData((prev) => ({ ...prev, email: userText }));
        botReply("Perfect. Last thing — what's your phone number?", "phone");
      }
    } else if (step === "phone") {
      const phoneDigits = userText.replace(/\D/g, "");
      const isValidPhone = PHONE_DIGIT_PATTERN.test(phoneDigits);
      if (!isValidPhone) {
        botReply("That doesn’t look like a valid phone number. Can you try again?", "phone");
        return;
      }
      const newData = { ...formData, phone: userText };
      setFormData(newData);
      const success = await submitToGHL(newData);
      if (success) {
        botReply("Thanks! Our team will reach out shortly.", "done");
      } else {
        botReply("Could you re-enter your phone? Let's try again.", "phone", RETRY_DELAY_MS);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">

      {/* CHAT BOX */}
      <div
        className={`
          mb-4 max-h-[80vh]
          w-[90vw] sm:w-[380px]
          bg-white/90 backdrop-blur-xl
          border border-white/50 shadow-2xl rounded-3xl
          overflow-hidden transition-all duration-500 origin-bottom-right
          ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10 pointer-events-none"}
        `}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Aria Assistant</h3>
              <p className="text-blue-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online now
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="h-[55vh] sm:h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 px-2">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t border-gray-100">
          {step === "done" ? (
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
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  step === "email"
                    ? "name@example.com"
                    : step === "phone"
                    ? "(555) 000-0000"
                    : "Type a message..."
                }
                className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none disabled:opacity-60"
                disabled={isSubmitting}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSubmitting}
                className="bg-blue-600 text-white p-3 rounded-full shadow-lg disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group w-14 h-14 sm:w-16 sm:h-16
          rounded-full shadow-2xl transition-all
          ${isOpen ? "bg-gray-900 rotate-90" : "bg-gradient-to-br from-blue-600 to-indigo-600 hover:scale-110"}
        `}
      >
        {isOpen ? (
          <X size={26} className="text-white" />
        ) : (
          <>
            <MessageSquare size={26} className="text-white" />

            <span className="absolute top-0 right-0 flex h-4 w-4 sm:h-5 sm:w-5 scale-90 sm:scale-100">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-red-500 text-[9px] sm:text-[10px] font-bold text-white items-center justify-center border-2 border-white">
                1
              </span>
            </span>

            <div
              className={`
                absolute right-[110%] bg-white px-3 py-2 rounded-xl shadow-xl text-gray-900 text-xs sm:text-sm font-bold transition-all
                ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
              `}
            >
              Chat with us!
              <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white rotate-45"></div>
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
