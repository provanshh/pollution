import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MoreHorizontal, Volume2, Bot, Languages } from 'lucide-react';
import { Ward } from '../types';
import { getChatResponse } from '../services/geminiService';

interface VoiceAssistantProps {
  wards: Ward[];
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ wards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // Set language based on state
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleQuery(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setResponse(language === 'hi' ? "क्षमा करें, दोबारा बोलें।" : "Sorry, I didn't catch that.");
      };
    }
  }, [wards, language]); // Re-initialize when language changes

  const handleQuery = async (text: string) => {
    setIsThinking(true);
    const answer = await getChatResponse(text, wards, language);
    setIsThinking(false);
    setResponse(answer);
    speak(answer);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        setResponse('');
        setIsListening(true);
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      setResponse("Voice recognition is not supported in this browser.");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to set a voice appropriate for the language
      const voices = window.speechSynthesis.getVoices();
      const langCode = language === 'hi' ? 'hi-IN' : 'en-US';
      const voice = voices.find(v => v.lang.includes(langCode));
      if (voice) utterance.voice = voice;
      utterance.lang = langCode;

      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
  }

  const toggleLanguage = () => {
      setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-500 transition-all hover:scale-110 z-50 flex items-center justify-center group"
      >
        <Bot size={28} />
        <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {language === 'hi' ? 'ईको-बॉट से पूछें' : 'Ask EcoBot'}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
            <Bot size={20} />
            <span className="font-bold">EcoBot {language === 'hi' && '(हिंदी)'}</span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleLanguage} 
                className="hover:bg-blue-700 p-1.5 rounded text-xs font-bold border border-blue-400 flex items-center gap-1"
                title="Switch Language"
            >
                <Languages size={14} /> {language.toUpperCase()}
            </button>
            <button onClick={() => { stopSpeaking(); setIsOpen(false); }} className="hover:bg-blue-700 p-1 rounded">
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 min-h-[150px] bg-slate-50 flex flex-col gap-3 max-h-80 overflow-y-auto">
        {!transcript && !response && (
            <div className="text-center text-slate-400 text-sm mt-4">
                {language === 'hi' 
                    ? 'माइक पर टैप करें और वायु गुणवत्ता के बारे में पूछें।' 
                    : 'Tap the mic and ask about air quality, specific wards, or health advice.'}
            </div>
        )}
        
        {transcript && (
            <div className="self-end bg-blue-100 text-blue-900 px-3 py-2 rounded-t-xl rounded-bl-xl text-sm max-w-[85%]">
                {transcript}
            </div>
        )}

        {isThinking && (
            <div className="self-start bg-white border border-slate-200 px-3 py-2 rounded-t-xl rounded-br-xl text-sm flex items-center gap-2 text-slate-500">
                <MoreHorizontal size={16} className="animate-pulse" /> {language === 'hi' ? 'सोच रहा हूँ...' : 'Thinking...'}
            </div>
        )}

        {response && (
             <div className="self-start bg-white border border-slate-200 px-3 py-2 rounded-t-xl rounded-br-xl text-sm text-slate-800 shadow-sm">
                {response}
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-t border-slate-100 flex justify-center items-center gap-4">
         {isSpeaking ? (
             <button onClick={stopSpeaking} className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors animate-pulse">
                 <Volume2 size={24} />
             </button>
         ) : (
            <button 
                onClick={startListening}
                className={`p-4 rounded-full transition-all shadow-lg ${isListening ? 'bg-red-500 text-white scale-110 ring-4 ring-red-200' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
                <Mic size={24} className={isListening ? 'animate-bounce' : ''} />
            </button>
         )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
