#!/usr/bin/env bash
set -euo pipefail

BRANCH="fix/mobile-pricing-and-realtime"
ORIGIN="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"

echo "This script will create branch: ${BRANCH} and overwrite files with provided fixes."
read -p "Continue? (y/N) " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted."
  exit 1
fi

# Create branch from main
git fetch origin main || true
git checkout -B "${BRANCH}" origin/main || git checkout -B "${BRANCH}" main

# Backup existing files (optional)
mkdir -p .repair-backup
files_to_backup=(
  "package.json"
  "vite.config.ts"
  "src/App.tsx"
  "src/styles.css"
  "src/components/FloatingChat.tsx"
  "src/components/ChatModal.tsx"
  "src/components/VoiceAssistantModal.tsx"
  "src/components/LeadCaptureModal.tsx"
  "src/components/Pricing.tsx"
  "api/ai-chat.ts"
  "api/aria-realtime.ts"
  "api/create-checkout-session.ts"
  "api/ghl-lead.ts"
)
for f in "${files_to_backup[@]}"; do
  if [[ -f "$f" ]]; then
    mkdir -p "$(dirname ".repair-backup/$f")"
    cp -a "$f" ".repair-backup/$f"
  fi
done

# Ensure directories exist
mkdir -p src/components api src public/static

# Write files (these are the corrected full-file contents)
cat > package.json <<'JSON'
{
  "name": "aria",
  "version": "1.0.0",
  "private": true,
  "description": "ARIA — AI Repetitionist (React + Vite + TypeScript)",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --strictPort --port 4173",
    "start": "vite",
    "typecheck": "tsc --noEmit",
    "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\" --max-warnings=0 || true",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  },
  "dependencies": {
    "openai": "^4.2.1",
    "stripe": "^12.6.0",
    "form-data": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@vercel/node": "^2.1.5",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.9.6",
    "vite": "^5.2.0",
    "eslint": "^8.48.0",
    "eslint-plugin-react": "^7.33.2",
    "prettier": "^3.11.1"
  },
  "engines": {
    "node": ">=18"
  }
}
JSON

cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    target: "es2018",
  },
});
TS

cat > src/App.tsx <<'TSX'
import React from "react";
import { createRoot } from "react-dom/client";
import FloatingChat from "./components/FloatingChat";
import Pricing from "./components/Pricing";
import ChatModal from "./components/ChatModal";
import VoiceAssistantModal from "./components/VoiceAssistantModal";
import LeadCaptureModal from "./components/LeadCaptureModal";

import "./styles.css";

const App: React.FC = () => {
  const [isChatOpen, setChatOpen] = React.useState(false);
  const [isVoiceOpen, setVoiceOpen] = React.useState(false);
  const [isLeadOpen, setLeadOpen] = React.useState(false);

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">
          <h1>ARIA</h1>
          <p className="tag">AI Repetitionist</p>
        </div>
        <nav className="nav">
          <button className="nav-btn" onClick={() => setLeadOpen(true)}>
            Capture Lead
          </button>
          <button className="nav-btn" onClick={() => setChatOpen(true)}>
            Chat
          </button>
          <button className="nav-btn primary" onClick={() => setVoiceOpen(true)}>
            Voice Assistant
          </button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>Repetition, refined by AI.</h2>
          <p>
            ARIA helps you create, repeat, and learn—powered by AI. Secure payments
            with Stripe, live chat, voice assistant, and lead capture.
          </p>
          <div className="hero-ctas">
            <button className="btn large primary" onClick={() => setChatOpen(true)}>
              Start Chat
            </button>
            <button className="btn large outline" onClick={() => setLeadOpen(true)}>
              Get a Demo
            </button>
          </div>
        </section>

        <Pricing onCheckout={() => { /* handled inside Pricing */ }} />
      </main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} ARIA</small>
      </footer>

      <FloatingChat
        onOpen={() => setChatOpen(true)}
        onOpenVoice={() => setVoiceOpen(true)}
        onOpenLead={() => setLeadOpen(true)}
      />

      {isChatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
      {isVoiceOpen && <VoiceAssistantModal onClose={() => setVoiceOpen(false)} />}
      {isLeadOpen && <LeadCaptureModal onClose={() => setLeadOpen(false)} />}
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

export default App;
TSX

cat > src/styles.css <<'CSS'
:root {
  --bg: #0f1724;
  --card: #0b1220;
  --muted: #96a0b3;
  --accent: #7c5cff;
  --white: #ffffff;
  --surface: #0f1724;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  background: linear-gradient(180deg, #071023 0%, #061021 100%);
  color: var(--white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  gap: 12px;
  background: rgba(6,10,20,0.5);
  position: sticky;
  top: 0;
  z-index: 60;
  backdrop-filter: blur(6px);
}

.brand h1 { margin: 0; font-size: 18px; }
.tag { margin: 0; font-size: 12px; color: var(--muted); }
.nav { display: flex; gap: 8px; align-items: center; }
.nav-btn { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--white); padding: 8px 10px; border-radius: 8px; font-size: 14px; }
.nav-btn.primary { background: var(--accent); border: none; padding: 8px 12px; }

.main-content { flex: 1; padding: 20px; max-width: 1100px; margin: 0 auto; width: 100%; }
.hero { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 12px; margin-bottom: 18px; }
.hero h2 { margin-top: 0; margin-bottom: 6px; }
.hero p { margin-top: 0; color: var(--muted); }
.hero-ctas { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }

.btn { border: none; border-radius: 10px; padding: 10px 14px; cursor: pointer; font-weight: 600; font-size: 14px; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
.btn.primary { background: var(--accent); color: white; }
.btn.outline { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: white; }

.pricing .cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.card { background: rgba(255,255,255,0.03); padding: 14px; border-radius: 12px; }
.card .btn { position: relative; z-index: 85; }
.card.popular { border: 1px solid rgba(124,92,255,0.2); box-shadow: 0 6px 24px rgba(124,92,255,0.06); }
.price { font-size: 20px; margin: 12px 0; }

.site-footer { padding: 14px; text-align: center; color: var(--muted); }

.floating-chat { position: fixed; right: 12px; bottom: 12px; z-index: 80; display: flex; align-items: center; gap: 8px; background: linear-gradient(90deg, rgba(124,92,255,0.95), rgba(51,196,255,0.9)); color: white; border-radius: 999px; padding: 8px; box-shadow: 0 6px 30px rgba(0,0,0,0.4); cursor: default; min-width: 48px; max-width: 320px; transition: width 200ms ease, transform 120ms; pointer-events: none; touch-action: manipulation; }
.floating-chat .floating-handle { display: flex; gap: 8px; align-items: center; padding-left: 8px; pointer-events: auto; cursor: pointer; outline: none; }
.floating-chat .dot { width: 10px; height: 10px; background: white; border-radius: 50%; display: inline-block; }
.floating-chat .label { font-weight: 700; display: none; }
.floating-chat.expanded { max-width: 320px; }
.floating-actions { display: flex; gap: 6px; align-items: center; padding-right: 8px; pointer-events: auto; }
.fab-btn { background: rgba(255,255,255,0.1); color: white; border: none; padding: 6px 8px; border-radius: 8px; font-size: 13px; cursor: pointer; }
.fab-close { background: transparent; border: none; color: white; font-size: 18px; cursor: pointer; }

.modal-backdrop { position: fixed; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55)); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 14px; }
.modal { width: 100%; max-width: 720px; background: rgba(7,10,20,0.95); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6); display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { display: flex; justify-content: space-between; padding: 12px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); }
.close-btn { background: transparent; border: none; color: var(--muted); font-size: 20px; }

.chat-body { padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 120px; }
.chat-bubble { max-width: 85%; padding: 10px 12px; border-radius: 12px; }
.chat-bubble.user { align-self: flex-end; background: rgba(255,255,255,0.06); }
.chat-bubble.assistant { align-self: flex-start; background: rgba(255,255,255,0.03); }
.typing-indicator { color: var(--muted); font-size: 18px; padding: 8px 0; }

.chat-input-row { display: flex; gap: 8px; padding: 12px; border-top: 1px solid rgba(255,255,255,0.02); background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent); }
.chat-input { flex: 1; border-radius: 8px; padding: 10px; border: 1px solid rgba(255,255,255,0.04); background: transparent; color: var(--white); }

.lead-form { display: flex; flex-direction: column; gap: 12px; padding: 14px; }
.field input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); background: transparent; color: var(--white); }
.form-actions { display: flex; gap: 8px; justify-content: flex-end; }
.success-banner { padding: 8px; background: rgba(40,200,100,0.1); border-radius: 8px; color: #bff0c6; text-align: center; }

@media (max-width: 720px) {
  .pricing .cards { grid-template-columns: 1fr; }
  .floating-chat .label { display: none; }
  .modal { max-width: 100%; width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
  .floating-chat { right: 10px; bottom: 10px; }
}
CSS

cat > src/components/FloatingChat.tsx <<'TSX'
import React from "react";

type Props = {
  onOpen?: () => void;
  onOpenVoice?: () => void;
  onOpenLead?: () => void;
};

const FloatingChat: React.FC<Props> = ({ onOpen, onOpenVoice, onOpenLead }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={`floating-chat ${expanded ? "expanded" : ""}`}
      aria-hidden={false}
      tabIndex={-1}
    >
      <div
        className="floating-handle"
        role="button"
        aria-label="Open ARIA"
        tabIndex={0}
        onClick={() => {
          if (expanded) {
            onOpen?.();
          } else {
            setExpanded(true);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (expanded) onOpen?.();
            else setExpanded(true);
          }
        }}
      >
        <span className="dot" />
        <span className="label">ARIA</span>
      </div>

      <div className="floating-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="fab-btn"
          onClick={() => onOpen?.()}
          aria-label="Open Chat"
        >
          Chat
        </button>
        <button
          className="fab-btn"
          onClick={() => onOpenVoice?.()}
          aria-label="Voice Assistant"
        >
          Voice
        </button>
        <button
          className="fab-btn"
          onClick={() => onOpenLead?.()}
          aria-label="Lead Capture"
        >
          Lead
        </button>
        <button
          className="fab-close"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          aria-label="Collapse"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
TSX

cat > src/components/ChatModal.tsx <<'TSX'
import React from "react";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
};

type Props = {
  onClose: () => void;
};

const ChatModal: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "m0", role: "system", text: "Welcome to ARIA. Ask me anything." },
  ]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setStreaming(true);

    try {
      const resp = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!resp.ok) {
        throw new Error("Network error");
      }

      const reader = resp.body?.getReader();
      if (!reader) {
        const text = await resp.text();
        setMessages((m) => [...m, { id: Date.now().toString(), role: "assistant", text }]);
        setStreaming(false);
        return;
      }

      let assistantText = "";
      const addChunk = (chunk: string) => {
        assistantText += chunk;
        setMessages((m) => {
          const last = m[m.length - 1];
          if (last?.role === "assistant" && last.id.startsWith("stream-")) {
            const updated = [...m];
            updated[updated.length - 1] = { ...last, text: assistantText };
            return updated;
          }
          return [...m, { id: "stream-" + Date.now(), role: "assistant", text: assistantText }];
        });
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const textChunk = new TextDecoder().decode(value);
        addChunk(textChunk);
      }
      setStreaming(false);
    } catch (err) {
      setStreaming(false);
      setMessages((m) => [
        ...m,
        { id: "err-" + Date.now(), role: "assistant", text: "Sorry — an error occurred. Please try again." },
      ]);
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal chat-modal">
        <div className="modal-header">
          <h3>ARIA Chat</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close chat">
            ×
          </button>
        </div>

        <div className="chat-body" ref={containerRef}>
          {messages.map((m) => (
            <div className={`chat-bubble ${m.role}`} key={m.id}>
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}
          {streaming && <div className="typing-indicator">●●●</div>}
        </div>

        <div className="chat-input-row">
          <input
            ref={inputRef}
            aria-label="Message"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Message ARIA..."
          />
          <button className="btn primary" onClick={sendMessage} disabled={streaming}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
TSX

cat > src/components/VoiceAssistantModal.tsx <<'TSX'
import React from "react";

type Props = {
  onClose: () => void;
};

const VoiceAssistantModal: React.FC<Props> = ({ onClose }) => {
  const [recording, setRecording] = React.useState(false);
  const [permissionError, setPermissionError] = React.useState<string | null>(null);
  const [transcript, setTranscript] = React.useState<string | null>(null);
  const [responseAudioUrl, setResponseAudioUrl] = React.useState<string | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    return () => {
      recorderRef.current?.stream?.getTracks()?.forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    setPermissionError(null);
    setTranscript(null);
    setResponseAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await submitAudio(blob);
      };
      recorder.start();
      setRecording(true);
    } catch (err: any) {
      console.error(err);
      setPermissionError("Microphone permission denied or not available.");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    recorderRef.current?.stop();
    recorderRef.current?.stream?.getTracks()?.forEach((t) => t.stop());
  };

  const submitAudio = async (blob: Blob) => {
    try {
      const b64 = await blobToBase64(blob);
      const resp = await fetch("/api/aria-realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio_base64: b64 }),
      });

      if (!resp.ok) throw new Error("Realtime endpoint error");

      const reader = resp.body?.getReader();
      if (!reader) {
        const json = await resp.json();
        setTranscript(json.transcript || "No transcript.");
        setResponseAudioUrl(json.audioUrl || null);
        return;
      }

      let partial = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const textChunk = new TextDecoder().decode(value);
        partial += textChunk;
        const messages = partial.split("\n").filter(Boolean);
        for (const line of messages) {
          try {
            const obj = JSON.parse(line);
            if (obj.transcript) setTranscript(obj.transcript);
            if (obj.audioUrl) setResponseAudioUrl(obj.audioUrl);
          } catch (e) {
            // ignore non-json chunks
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const blobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        const cleaned = data.split(",")[1] || "";
        resolve(cleaned);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal voice-modal">
        <div className="modal-header">
          <h3>Voice Assistant</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="voice-body">
          <div className="controls">
            {!recording ? (
              <button className="btn primary" onClick={startRecording}>
                Start Recording
              </button>
            ) : (
              <button className="btn outline" onClick={stopRecording}>
                Stop
              </button>
            )}
            {permissionError && <div className="error-text">{permissionError}</div>}
          </div>

          <div className="transcript">
            <strong>Transcript:</strong>
            <div className="transcript-text">{transcript || "—"}</div>
          </div>

          {responseAudioUrl && (
            <div className="response-audio">
              <audio
                ref={audioRef}
                src={responseAudioUrl}
                controls
                preload="auto"
                playsInline
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
TSX

cat > src/components/LeadCaptureModal.tsx <<'TSX'
import React from "react";

type Props = {
  onClose: () => void;
};

const LeadCaptureModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const submitLead = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ghl-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!res.ok) throw new Error("Failed to submit lead");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to submit lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal lead-modal">
        <div className="modal-header">
          <h3>Request a Demo</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="lead-form" onSubmit={submitLead}>
          <label className="field">
            <span className="label">Full name</span>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </label>

          <label className="field">
            <span className="label">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 555 5555"
            />
          </label>

          <div className="form-actions">
            <button className="btn outline" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Request Demo"}
            </button>
          </div>

          {success && <div className="success-banner">Thanks — we'll be in touch!</div>}
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
TSX

cat > src/components/Pricing.tsx <<'TSX'
import React from "react";

type Props = {
  onCheckout?: (priceId?: string) => void;
};

const Pricing: React.FC<Props> = ({ onCheckout }) => {
  const [processing, setProcessing] = React.useState(false);

  const handleCheckout = async (priceId: string) => {
    setProcessing(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const json = await res.json();
      if (json.url) {
        window.location.assign(json.url);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="pricing">
      <h3>Plans</h3>
      <div className="cards">
        <div className="card">
          <h4>Starter</h4>
          <p className="price">$9 / month</p>
          <ul className="features">
            <li>Basic chat</li>
            <li>Limited voice minutes</li>
          </ul>
          <button
            className="btn primary"
            onClick={() => handleCheckout("price_starter_001")}
            disabled={processing}
          >
            Get Started
          </button>
        </div>
        <div className="card popular">
          <h4>Pro</h4>
          <p className="price">$29 / month</p>
          <ul className="features">
            <li>Unlimited chat</li>
            <li>Priority voice</li>
            <li>Advanced integrations</li>
          </ul>
          <button
            className="btn primary"
            onClick={() => handleCheckout("price_pro_001")}
            disabled={processing}
          >
            Start Pro
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
TSX

cat > api/ai-chat.ts <<'TS'
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * ai-chat.ts
 *
 * Serverless endpoint that proxies to OpenAI Chat Completions with streaming.
 *
 * Requirements:
 * - Environment variable OPENAI_API_KEY must be set.
 *
 * Behavior:
 * - Accepts POST { prompt: string, model?: string }
 * - Streams assistant tokens back to the client as plain text chunks.
 */

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!OPENAI_KEY) {
    res.status(500).json({ error: "OPENAI_API_KEY not configured" });
    return;
  }

  try {
    const { prompt, model } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }

    const chosenModel = typeof model === "string" && model.length > 0 ? model : "gpt-3.5-turbo";

    // Call OpenAI Chat Completions (streaming)
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: [{ role: "user", content: prompt }],
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!openaiResp.ok || !openaiResp.body) {
      const text = await openaiResp.text();
      res.setHeader("Content-Type", "application/json");
      res.status(openaiResp.status).send({ error: text });
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.writeHead(200);

    const reader = openaiResp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const flushJsonLine = (line: string) => {
      if (!line.startsWith("data:")) return;
      const payload = line.replace(/^data:\s*/, "");
      if (payload === "[DONE]") {
        return "DONE";
      }
      try {
        const parsed = JSON.parse(payload);
        const delta =
          parsed?.choices?.[0]?.delta?.content ??
          parsed?.choices?.[0]?.delta ??
          null;
        const text = delta ?? parsed?.choices?.[0]?.message?.content ?? "";
        return text;
      } catch (err) {
        return "";
      }
    };

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (readerDone) break;
      buffer += decoder.decode(value, { stream: true });
      let idx = buffer.indexOf("\n");
      while (idx !== -1) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) {
          idx = buffer.indexOf("\n");
          continue;
        }
        const result = flushJsonLine(line);
        if (result === "DONE") {
          done = true;
          break;
        }
        if (result && result.length > 0) {
          try {
            res.write(result);
          } catch (e) {
            console.error("Client disconnected while streaming", e);
            done = true;
            break;
          }
        }
        idx = buffer.indexOf("\n");
      }
    }

    if (buffer.trim()) {
      const parts = buffer.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const p of parts) {
        const result = flushJsonLine(p);
        if (result && result !== "DONE") {
          res.write(result);
        }
      }
    }

    res.end();
  } catch (err)

