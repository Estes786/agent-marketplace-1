
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

interface GaniAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

type ContextType = 'marketplace' | 'dashboard' | 'architect' | 'medialab';

interface ContextConfig {
  greeting: string;
  commands: string[];
}

const CONTEXT_MAP: Record<ContextType, ContextConfig> = {
  marketplace: {
    greeting: "Halo Gyss! I am GANI. Looking for a specialized Legacy Pod? I can help you find the perfect microservice for your digital empire.",
    commands: ["Most popular pods?", "What is a Legacy Pod?", "Free tier options?"]
  },
  dashboard: {
    greeting: "Chief, all Hypha nodes are synchronized. I'm monitoring your A2A throughput and node health. Need a status report?",
    commands: ["Node health status", "Recent logs", "Sync telemetry now"]
  },
  architect: {
    greeting: "Architectural Engine at full power. Ready to design custom autonomous lifeforms. Describe your vision, Gyss.",
    commands: ["Design a Barber bot", "Explain Multi-Tenant RLS", "Best model for analysis?"]
  },
  medialab: {
    greeting: "Visual Studio synchronized. Ready to analyze video content or synthesize 4K cinematic assets. What's the mission?",
    commands: ["Generate a cyborg image", "Video analysis tips", "Aspect ratio advice"]
  }
};

const GaniAssistant: React.FC<GaniAssistantProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getContext = (): ContextType => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/architect') return 'architect';
    if (path === '/media-lab') return 'medialab';
    return 'marketplace';
  };

  const context = getContext();
  const config = CONTEXT_MAP[context];

  useEffect(() => {
    const welcomeMsg: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: config.greeting,
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, [location.pathname, config.greeting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageContent, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Map routing context to the service's expected context types
      const serviceContext = context === 'medialab' ? 'onboarding' : (context === 'marketplace' ? 'onboarding' : context);
      const response = await gemini.getGaniResponse([...messages, userMsg], serviceContext as any);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "Mycelium link unstable, Gyss! Re-establishing connection... try again.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto'}`}>
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden glass">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-inner">🌀</div>
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-tighter">GANI_HYPHA_OS</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-indigo-100 font-medium uppercase tracking-widest">{context} Mode</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors text-white">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow-lg'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
            {/* Context Commands */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {config.commands.map(cmd => (
                <button
                  key={cmd}
                  onClick={() => handleSend(cmd)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-indigo-300 hover:border-indigo-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask about ${context}, Gyss...`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button onClick={() => handleSend()} disabled={isLoading} className="absolute right-2 top-2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors disabled:opacity-50">↑</button>
            </div>
            <p className="text-[9px] text-slate-500 text-center mt-1 uppercase tracking-[0.2em] font-mono">Master Engine: Synchronized ✅</p>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-105 active:scale-95 group relative border-2 border-indigo-400/30">
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
          🌀
        </button>
      )}
    </div>
  );
};

export default GaniAssistant;
