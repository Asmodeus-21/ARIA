import React, { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff } from "lucide-react";

interface Props {
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<
    { from: "user" | "aria"; text: string }[]
  >([]);

  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Click to start");
  const [volume, setVolume] = useState(0);

  // WebSocket to ElevenLabs Proxy
  const wsRef = useRef<WebSocket | null>(null);

  // Recorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start WebSocket connection to your Vercel Edge proxy
  const connectWS = () => {
    const ws = new WebSocket(
      `wss://${window.location.host}/api/aria-realtime`
    );

    ws.onopen = () => {
      console.log("Connected to ElevenLabs agent");
      setStatus("Connected. Press mic to talk.");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "assistant_response") {
          // Text bubble
          if (msg.text) {
            setMessages((prev) => [...prev, { from: "aria", text: msg.text }]);
          }

          // Audio playback
          if (msg.audio) {
            const audio = new Audio("data:audio/wav;base64," + msg.audio);
            audio.play();
          }
        }
      } catch (err) {
        console.error("Bad WS message:", err);
      }
    };

    ws.onclose = () => {
      setStatus("Disconnected");
    };

    wsRef.current = ws;
  };

  // Start recording audio
  const startRecording = async () => {
    setIsListening(true);
    setStatus("Listening...");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    // Volume visualization
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detectVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg =
        dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length / 255;
      setVolume(avg);
      if (isListening) requestAnimationFrame(detectVolume);
    };
    detectVolume();

    recorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      blob.arrayBuffer().then((buffer) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(buffer);
        }
      });
    };

    recorder.start();
  };

  // Stop recording
  const stopRecording = () => {
    setIsListening(false);
    setStatus("Processing...");

    mediaRecorderRef.current?.stop();
  };

  const toggleListen = () => {
    if (!isListening) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Initialize on mount
  useEffect(() => {
    connectWS();

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Aria Live Demo
          </h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 max-w-[80%] rounded-xl shadow-sm ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Mic */}
        <div className="p-6 border-t border-gray-200 flex flex-col items-center">

          <div className="relative">
            {isListening && (
              <div
                className="absolute inset-0 bg-blue-500/30 rounded-full"
                style={{
                  transform: `scale(${1 + volume * 2})`,
                  transition: "transform 100ms ease-out",
                }}
              />
            )}

            <button
              onClick={toggleListen}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>

          <p className="mt-4 text-gray-500 text-sm uppercase tracking-wide font-medium">
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
