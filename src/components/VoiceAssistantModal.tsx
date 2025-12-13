import React, { useState, useRef, useEffect } from "react";
import { X, Mic, MicOff } from "lucide-react";

interface Props {
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ from: "user" | "aria"; text: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Tap mic to start");
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Process audio with the realtime API
  const processAudio = async (audioBlob: Blob) => {
    try {
      setStatus("Processing...");

      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');

      // Send to API
      const response = await fetch('/api/aria-realtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_base64: base64Audio
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      // Read newline-delimited JSON response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const msg = JSON.parse(line);

            if (msg.type === 'transcription') {
              setMessages((prev) => [...prev, { from: "user", text: msg.text }]);
            } else if (msg.type === 'response') {
              setMessages((prev) => [...prev, { from: "aria", text: msg.text }]);
            } else if (msg.type === 'audio' && msg.audio_base64) {
              // Play audio response
              const audio = new Audio(`data:audio/mpeg;base64,${msg.audio_base64}`);
              audio.play().catch(err => console.error('Audio playback error:', err));
            }
          } catch (err) {
            console.error("JSON parse error:", err);
          }
        }
      }

      setStatus("Ready. Tap mic to talk again.");
    } catch (err) {
      console.error("Audio processing error:", err);
      setStatus("Error. Try again.");
    }
  };

  // Voice recording
  const startRecording = async () => {
    setIsListening(true);
    setStatus("Listening...");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    // Volume animation
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const arr = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(arr);
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length / 255;
      setVolume(avg);
      if (isListening) requestAnimationFrame(loop);
    };
    loop();

    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      processAudio(blob);
    };

    recorder.start();
  };

  const stopRecording = () => {
    setIsListening(false);
    mediaRecorderRef.current?.stop();
  };

  const toggleListen = () => {
    if (!isListening) startRecording();
    else stopRecording();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[30000] p-4">
      <div className="bg-white/95 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <header className="p-6 border-b border-gray-200 flex justify-between items-center bg-white/70">
          <h2 className="text-xl font-bold text-gray-900">Aria Live Demo</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-3 rounded-xl max-w-[80%] shadow ${
                  m.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Mic Button */}
        <footer className="p-6 border-t border-gray-200 flex flex-col items-center bg-white/70">
          <div className="relative">
            {isListening && (
              <div
                className="absolute inset-0 bg-blue-500/30 rounded-full"
                style={{
                  transform: `scale(${1 + volume * 2})`,
                  transition: "100ms ease-out",
                }}
              />
            )}

            <button
              onClick={toggleListen}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition cursor-pointer ${
                isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-600 font-medium tracking-wide uppercase">
            {status}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
