
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeployedEcosystem, Blueprint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gemini } from '../services/geminiService';

interface DashboardProps {
  ecosystems: DeployedEcosystem[];
  blueprints: Blueprint[];
}

const Dashboard: React.FC<DashboardProps> = ({ ecosystems, blueprints }) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(ecosystems[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'Telemetry' | 'Monitoring' | 'Console'>('Telemetry');
  
  // Console state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, {role: 'user' | 'assistant', content: string}[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const selected = ecosystems.find(e => e.id === selectedId);
  const selectedBlueprint = blueprints.find(b => b.id === selected?.blueprintId);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  const monitoringData = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      hour: `${i}:00`,
      compute: Number((10 + Math.random() * 15).toFixed(1)),
      a2a: Math.floor(500 + Math.random() * 1000),
      state: Math.floor(700 + Math.random() * 300),
    }));
  }, [selectedId]);

  const handleConsoleSend = async () => {
    if (!chatInput.trim() || !selected || !selectedBlueprint || isTyping) return;
    
    const userMsg = { role: 'user' as const, content: chatInput };
    setChatHistory(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), userMsg]
    }));
    setChatInput('');
    setIsTyping(true);

    try {
      const currentHistory = chatHistory[selected.id] || [];
      const response = await gemini.talkToPod(selectedBlueprint, userMsg.content, currentHistory);
      
      setChatHistory(prev => ({
        ...prev,
        [selected.id]: [...(prev[selected.id] || []), { role: 'assistant' as const, content: response }]
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (ecosystems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 mb-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            System Initialized
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Command Center Onboarding</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Welcome to the Hypha Master Engine. Your Command Center is currently idling. Deploy an agentic microservice to begin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 1, title: "Marketplace Discovery", desc: "Browse legacy pods and sync nodes to the Edge.", icon: "🏪", path: "/" },
            { id: 2, title: "Custom Architecture", desc: "Design autonomous lifeforms from scratch.", icon: "🏗️", path: "/architect" }
          ].map(step => (
            <div key={step.id} onClick={() => navigate(step.path)} className="glass rounded-[2rem] p-10 border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div className="text-5xl mb-6">{step.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm mb-8">{step.desc}</p>
              <div className="text-indigo-400 font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">Get Started →</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500 h-full">
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-4">Active Legacy Pods</h5>
        {ecosystems.map(eco => (
          <button
            key={eco.id}
            onClick={() => setSelectedId(eco.id)}
            className={`w-full text-left p-5 rounded-3xl transition-all border group relative overflow-hidden ${
              selectedId === eco.id ? 'bg-indigo-600/10 border-indigo-500 shadow-2xl' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-white text-sm">{eco.name}</h4>
              <div className={`w-2 h-2 rounded-full mt-1 ${eco.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase font-bold">Node Health</span>
                <span className="text-xs font-mono font-bold text-indigo-400">98.2%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase font-bold">Latency</span>
                <span className="text-xs font-mono font-bold text-slate-300">42ms</span>
              </div>
            </div>
          </button>
        ))}
        
        {/* Live A2A Activity Ticker */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 mt-8">
          <p className="text-[9px] font-bold text-slate-500 uppercase mb-3">Global A2A Traffic</p>
          <div className="space-y-2 opacity-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between font-mono text-[8px] text-emerald-400/80">
                <span>TX_NOD_{Math.floor(Math.random()*999)}</span>
                <span>→ SYNC_OK</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col h-full gap-6">
        {selected ? (
          <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col flex-1 shadow-2xl">
            <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-indigo-900/10 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white tracking-tighter mb-1">{selected.name}</h3>
                  <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.3em]">Hypha Orchestration Protocol v1.0</p>
                </div>
                <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
                  {['Telemetry', 'Monitoring', 'Console'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as any)} 
                      className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Compute usage', value: '12.4ms' },
                  { label: 'A2A Throughput', value: '1.4k/h' },
                  { label: 'Isolated Memory', value: '842KB' },
                  { label: 'Mycelium Sync', value: '100%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800/50">
                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1.5">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-8 bg-slate-950/20 flex flex-col min-h-0">
              {activeTab === 'Telemetry' ? (
                <div className="flex flex-col h-full">
                  <div className="bg-black/60 rounded-[2rem] p-6 font-mono text-[10px] overflow-y-auto space-y-3 border border-slate-800 flex-1">
                    {selected.logs.map((log, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-indigo-500/50">POD_LOG:</span>
                        <span className="text-slate-300">{log}</span>
                      </div>
                    ))}
                    <div className="animate-pulse text-indigo-400/50">_ Awaiting kernel events...</div>
                  </div>
                </div>
              ) : activeTab === 'Monitoring' ? (
                <div className="flex-1 bg-slate-900/40 rounded-[2rem] border border-slate-800 p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monitoringData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="hour" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                      <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="compute" stroke="#6366f1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="a2a" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col h-full bg-slate-900/50 rounded-[2rem] border border-slate-800 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl rounded-bl-none text-xs text-indigo-200 max-w-[80%]">
                        Hypha Node ${selected.id} Synchronized. Command orchestrator active. How should I optimize your digital empire today?
                      </div>
                    </div>
                    {(chatHistory[selected.id] || []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl text-xs max-w-[80%] ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-700">
                          <span className="animate-pulse text-indigo-400">Processing Node Request...</span>
                        </div>
                      </div>
                    )}
                    <div ref={consoleEndRef} />
                  </div>
                  <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-4">
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleConsoleSend()}
                      placeholder="Enter command for pod orchestrator..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <button 
                      onClick={handleConsoleSend} 
                      disabled={isTyping}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      EXECUTE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full glass rounded-[2.5rem] flex items-center justify-center text-slate-600 border border-slate-900 uppercase font-mono tracking-[0.5em] text-xs">
            Awaiting_Pod_Selection...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
