import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const VoiceAssistantModal: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ from: 'user' | 'aria'; text: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Click to start');
  const [volume, setVolume] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const connectWS = () => {
    const ws = new WebSocket(`wss://${window.location.host}/api/aria-realtime`);

    ws.onopen = () => setStatus('Connected. Tap mic to talk.');

    ws.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'assistant_response') {
          if (msg.text) {
            setMessages(prev => [...prev, { from: 'aria', text: msg.text }]);
          }
          if (msg.audio) {
            new Audio(`data:audio/wav;base64,${msg.audio}`).play();
          }
        }
      } catch (err) {
        console.error('Bad WS message:', err);
      }
    };

    ws.onclose = () => setStatus('Disconnected');

    wsRef.current = ws;
  };

  const startRecording = async () => {
    setIsListening(true);
    setStatus('Listening...');

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255;
      setVolume(avg);

      if (isListening) requestAnimationFrame(detect);
    };
    detect();

    recorder.ondataavailable = e => audioChunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      blob.arrayBuffer().then(buffer => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(buffer);
        }
      });
    };

    recorder.start();
  };

  const stopRecording = () => {
    setIsListening(false);
    setStatus('Processing...');
    mediaRecorderRef.current?.stop();
  };

  const toggleListen = () => {
    if (!isListening) startRecording();
    else stopRecording();
  };

  useEffect(() => {
    connectWS();
    return () => wsRef.current?.close();
  }, []);

  return (
    <div className="fixed inset-0 z-[20000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Aria Live Demo</h2>
          <button className="text-gray-600 hover:text-gray-900 cursor-pointer" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-3 rounded-xl max-w-[80%] shadow ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* MIC BUTTON */}
        <div className="p-6 border-t border-gray-200 flex flex-col items-center">
          <div className="relative">
            {isListening && (
              <div
                className="absolute inset-0 bg-blue-500/30 rounded-full"
                style={{ transform: `scale(${1 + volume * 2})`, transition: '100ms ease-out' }}
              />
            )}

            <button
              onClick={toggleListen}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition ${
                isListening ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>

          <p className="mt-4 text-gray-500 text-sm uppercase tracking-wide">{status}</p>
        </div>

      </div>
    </div>
  );
};

export default VoiceAssistantModal;
