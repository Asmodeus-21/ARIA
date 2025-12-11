
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Blob as GenAIBlob, Modality } from '@google/genai';

// Helper Functions for audio processing
const decode = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const encode = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

interface VoiceAssistantModalProps {
    onClose: () => void;
    autoStart?: boolean;
    systemInstruction?: string;
    initialMessage?: string;
}

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose, autoStart = false, systemInstruction, initialMessage }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Click the mic to start');
  const [transcriptions, setTranscriptions] = useState<{ speaker: 'user' | 'model', text: string }[]>(
    initialMessage ? [{ speaker: 'model', text: initialMessage }] : []
  );
  const [realtimeUser, setRealtimeUser] = useState('');
  const [realtimeModel, setRealtimeModel] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // LiveSession is not exported from @google/genai, so we use any here.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionRef = useRef<any | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions, realtimeUser, realtimeModel]);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
        sessionRef.current.close();
        sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsListening(false);
    setStatus('Click the mic to start');
    setVolumeLevel(0);
    setRealtimeUser('');
    setRealtimeModel('');
  }, []);
  
  const connect = async () => {
    setIsListening(true);
    setStatus('Connecting to Aria...');
    
    try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
            responseModalities: [Modality.AUDIO], 
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            systemInstruction: systemInstruction || 'You are Aria, a friendly AI receptionist. Introduce yourself immediately.',
            inputAudioTranscription: {},
            outputAudioTranscription: {},
        },
        callbacks: {
            onopen: async () => {
                sessionRef.current = await sessionPromiseRef.current!;
                setStatus('Aria is listening');
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;

                audioContextRef.current = new (window.AudioContext)({ sampleRate: 16000 });
                outputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 24000 });
                
                const source = audioContextRef.current.createMediaStreamSource(stream);
                scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
                
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                source.connect(analyserRef.current);
                
                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    
                    let sum = 0;
                    for(let i=0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                    setVolumeLevel(Math.sqrt(sum / inputData.length));

                    const l = inputData.length;
                    const int16 = new Int16Array(l);
                    for (let i = 0; i < l; i++) {
                        int16[i] = inputData[i] * 32768;
                    }
                    const pcmBlob: GenAIBlob = {
                        data: encode(new Uint8Array(int16.buffer)),
                        mimeType: 'audio/pcm;rate=16000',
                    };
                    
                    sessionPromiseRef.current?.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };
                source.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(audioContextRef.current.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                const outputContext = outputAudioContextRef.current;
                
                if (message.serverContent?.outputTranscription?.text) {
                    setRealtimeModel(prev => prev + message.serverContent?.outputTranscription?.text);
                }
                if (message.serverContent?.inputTranscription?.text) {
                    setRealtimeUser(prev => prev + message.serverContent?.inputTranscription?.text);
                }

                if (message.serverContent?.turnComplete) {
                   setRealtimeUser(prev => {
                       if (prev) setTranscriptions(h => [...h, { speaker: 'user', text: prev }]);
                       return '';
                   });
                   setRealtimeModel(prev => {
                       if (prev) setTranscriptions(h => [...h, { speaker: 'model', text: prev }]);
                       return '';
                   });
                }

                const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                if (base64Audio && outputContext) {
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContext.currentTime);
                    const audioBuffer = await decodeAudioData(decode(base64Audio), outputContext, 24000, 1);
                    const source = outputContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputContext.destination);
                    
                    const currentSources = audioSourcesRef.current;
                    source.addEventListener('ended', () => {
                        currentSources.delete(source);
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    currentSources.add(source);
                }

                if (message.serverContent?.interrupted) {
                    audioSourcesRef.current.forEach(source => source.stop());
                    audioSourcesRef.current.clear();
                    nextStartTimeRef.current = 0;
                    setRealtimeModel('');
                }
            },
            onerror: (e) => {
                console.error('Gemini Live API error:', e);
                setStatus('Connection error. Please try again.');
                cleanup();
            },
            onclose: () => {
                cleanup();
            },
        },
    });
    } catch (error) {
    console.error('Failed to start voice session:', error);
    setStatus('Failed to start. Check permissions.');
    cleanup();
    }
  };

  const handleToggleListen = () => {
    if (isListening) {
      cleanup();
    } else {
      connect();
    }
  };

  useEffect(() => {
    if (autoStart) {
        connect();
    }
    return () => cleanup();
  }, []);

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-lg h-[80vh] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-white/50 ring-1 ring-black/5">
        
        <header className="flex-none p-6 flex justify-between items-center border-b border-gray-100/50">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                {isListening && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>}
             </div>
             <h2 className="text-xl font-bold text-gray-900 tracking-tight">Live Demo</h2>
          </div>
          <button onClick={() => { cleanup(); onClose(); }} className="p-2 rounded-full hover:bg-gray-100/80 transition-colors text-gray-500 cursor-pointer">
            <X size={24} />
          </button>
        </header>
        
        <div className="flex-1 overflow-hidden relative flex flex-col bg-transparent">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {transcriptions.length === 0 && !realtimeUser && !realtimeModel && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 animate-bounce-slow">
                             <Activity size={32} className="text-blue-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Connecting secure line...</p>
                    </div>
                )}
                
                {transcriptions.map((t, i) => (
                    <div key={i} className={`flex ${t.speaker === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                        <div className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm backdrop-blur-sm ${
                            t.speaker === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                            : 'bg-white/70 border border-white/60 text-gray-800 rounded-bl-none shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                        }`}>
                            <p className="text-base leading-relaxed">{t.text}</p>
                        </div>
                    </div>
                ))}

                {realtimeUser && (
                    <div className="flex justify-end">
                         <div className="max-w-[85%] rounded-2xl px-6 py-4 shadow-sm bg-blue-600/90 text-white rounded-br-none backdrop-blur-sm">
                            <div className="flex gap-1 items-center">
                                <p className="text-base leading-relaxed">{realtimeUser}</p>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse ml-1"></span>
                            </div>
                        </div>
                    </div>
                )}

                {realtimeModel && (
                    <div className="flex justify-start">
                         <div className="max-w-[85%] rounded-2xl px-6 py-4 shadow-sm bg-white/60 text-gray-800 rounded-bl-none border border-white/60 backdrop-blur-sm">
                             <div className="flex gap-1 items-center">
                                <p className="text-base leading-relaxed">{realtimeModel}</p>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse ml-1"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex-none p-8 border-t border-gray-100/50 bg-white/40 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                  {isListening && (
                     <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20" style={{ 
                         transform: `scale(${1 + volumeLevel * 2})`,
                         transition: 'transform 100ms ease-out' 
                     }}></div>
                  )}
                  {isListening && (
                     <div className="absolute inset-0 bg-blue-400 rounded-full opacity-10 animate-ping"></div>
                  )}
                  
                  <button
                    onClick={handleToggleListen}
                    className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer ${isListening ? 'bg-gradient-to-br from-red-500 to-pink-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}
                  >
                    {isListening ? <MicOff size={32} className="text-white drop-shadow-md" /> : <Mic size={32} className="text-white drop-shadow-md" />}
                  </button>
              </div>
              <p className="mt-6 text-sm font-semibold text-gray-500 uppercase tracking-widest">{status}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceAssistantModal;
