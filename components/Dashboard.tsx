
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DeployedEcosystem, Blueprint } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { gemini } from '../services/geminiService';

interface DashboardProps {
  ecosystems: DeployedEcosystem[];
  blueprints: Blueprint[];
}

const Dashboard: React.FC<DashboardProps> = ({ ecosystems, blueprints }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(ecosystems[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'Telemetry' | 'Neural Mesh' | 'Monitoring' | 'Console'>('Telemetry');
  
  // Console state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<string, {role: 'user' | 'assistant', content: string}[]>>({});
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Sync selected pod with URL parameter
  useEffect(() => {
    const podId = searchParams.get('podId');
    if (podId && ecosystems.some(e => e.id === podId)) {
      setSelectedId(podId);
    }
  }, [searchParams, ecosystems]);

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

  const nodeHeatmap = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => ({
      id: i,
      load: Math.random() * 100,
      active: Math.random() > 0.1
    }));
  }, [selectedId]);

  const handleConsoleSend = async (textOverride?: string) => {
    const textToSend = textOverride || chatInput;
    if (!textToSend.trim() || !selected || !selectedBlueprint || isTyping) return;
    
    const userMsg = { role: 'user' as const, content: textToSend };
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
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-2">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            System Node: IDLE
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tighter">Command Center</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Welcome to the Hypha Master Engine. Your orchestration layer is awaiting deployment. Sync a new Legacy Pod to begin real-time management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { id: 1, title: "Marketplace Hub", desc: "Browse pre-configured legacy pods and industry workforce microservices.", icon: "🏪", path: "/" },
            { id: 2, title: "Architect Engine", desc: "Design high-fidelity custom agentic ecosystems from raw specifications.", icon: "🏗️", path: "/architect" }
          ].map(step => (
            <div key={step.id} onClick={() => navigate(step.path)} className="glass rounded-[2.5rem] p-12 border border-slate-800/60 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">{step.icon}</div>
              <div className="text-6xl mb-8 transform group-hover:scale-110 transition-transform duration-500">{step.icon}</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-base mb-10 font-medium leading-relaxed">{step.desc}</p>
              <div className="inline-flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform">
                Initiate Protocol <span className="text-lg">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-700 h-full p-2">
      <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-3 scrollbar-hide pb-10">
        <div className="flex items-center justify-between px-3">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Active Legacy Pods</h5>
          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/20">{ecosystems.length}</span>
        </div>
        
        <div className="space-y-3">
          {ecosystems.map(eco => (
            <button
              key={eco.id}
              onClick={() => {
                setSelectedId(eco.id);
                navigate(`/dashboard?podId=${eco.id}`, { replace: true });
              }}
              className={`w-full text-left p-6 rounded-[2rem] transition-all border group relative overflow-hidden ${
                selectedId === eco.id 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-2xl shadow-indigo-600/5' 
                : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              {selectedId === eco.id && (
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-indigo-500/10 to-transparent"></div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-white text-base tracking-tight leading-tight">{eco.name}</h4>
                  <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">ID: {eco.id}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                  eco.status === 'Active' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${eco.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                  <span className="text-[8px] font-black uppercase tracking-tighter">{eco.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest mb-1">Node Health</span>
                  <span className="text-sm font-mono font-bold text-indigo-400">98.2%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest mb-1">Latency</span>
                  <span className="text-sm font-mono font-bold text-slate-300">42ms</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Live A2A Activity Ticker */}
        <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-900/60 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Global A2A Traffic</p>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center font-mono text-[9px] group cursor-default">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700">TX_NOD_{100 + i * 15}</span>
                  <span className="text-slate-800">→</span>
                  <span className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors">SYNC_OK</span>
                </div>
                <span className="text-[8px] text-slate-800">3ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col h-full gap-6">
        {selected ? (
          <div className="glass rounded-[3rem] border border-slate-800/60 overflow-hidden flex flex-col flex-1 shadow-3xl bg-slate-950/10">
            <div className="p-10 border-b border-slate-800/40 bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-4xl font-bold text-white tracking-tighter leading-none">{selected.name}</h3>
                    <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500">⚙️</button>
                  </div>
                  <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em] font-medium">Hypha Orchestration Protocol v1.2.0-STABLE</p>
                </div>
                
                <div className="flex bg-slate-900/60 p-1.5 rounded-[1.5rem] border border-slate-800/60 shadow-inner overflow-x-auto scrollbar-hide">
                  {['Telemetry', 'Neural Mesh', 'Monitoring', 'Console'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as any)} 
                      className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeTab === tab 
                        ? 'bg-slate-800 text-white shadow-2xl border border-slate-700/50' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Compute usage', value: '12.4ms', trend: 'down', color: 'text-emerald-400' },
                  { label: 'A2A Throughput', value: '1.4k/h', trend: 'up', color: 'text-white' },
                  { label: 'Isolated Memory', value: '842KB', trend: 'stable', color: 'text-white' },
                  { label: 'Mycelium Sync', value: '100%', trend: 'max', color: 'text-indigo-400' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/40 hover:border-slate-700/60 transition-all group">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">{stat.label}</p>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">📈</span>
                    </div>
                    <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-10 bg-black/5 flex flex-col min-h-0 relative">
              {activeTab === 'Telemetry' ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#020617]/80 rounded-[2.5rem] p-8 font-mono text-[11px] overflow-y-auto space-y-4 border border-slate-800/60 flex-1 shadow-inner custom-scrollbar">
                    {selected.logs.map((log, i) => (
                      <div key={i} className="flex gap-6 group hover:bg-slate-900/40 transition-colors py-1 px-2 rounded-lg">
                        <span className="text-slate-700 shrink-0 font-medium">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                        <span className="text-indigo-500/60 shrink-0 font-bold tracking-tighter">POD_ORCH:</span>
                        <span className="text-slate-300 leading-relaxed font-medium">{log}</span>
                      </div>
                    ))}
                    <div className="flex gap-6 py-1 px-2">
                      <span className="text-slate-800 shrink-0">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                      <span className="text-indigo-500/40 animate-pulse font-bold tracking-tighter">NODE_LISTENER:</span>
                      <span className="text-indigo-400/60 animate-pulse italic font-medium">_ Awaiting master kernel synchronization events...</span>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'Neural Mesh' ? (
                 <div className="flex-1 flex items-center justify-center p-4 animate-in zoom-in-95 duration-500 overflow-hidden relative bg-slate-950/40 rounded-[2.5rem] border border-slate-800/60 shadow-inner">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                       <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                         <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="0.5"/>
                       </pattern>
                       <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    
                    <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-center">
                       {/* Center Node: Orchestrator */}
                       <div className="absolute w-24 h-24 bg-indigo-600 rounded-3xl flex flex-col items-center justify-center border-4 border-indigo-400 shadow-[0_0_50px_rgba(79,70,229,0.5)] z-20">
                          <span className="text-2xl">🌀</span>
                          <span className="text-[8px] font-black text-white mt-1 uppercase tracking-widest">MASTER</span>
                       </div>

                       {/* Sub-Nodes Roles Visualization */}
                       {selectedBlueprint.roles.map((role, idx) => {
                          const total = selectedBlueprint.roles.length;
                          const angle = (idx / total) * 2 * Math.PI;
                          const x = Math.cos(angle) * 160;
                          const y = Math.sin(angle) * 160;
                          
                          return (
                            <React.Fragment key={role}>
                              {/* Connection Line */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                 <line 
                                   x1="50%" y1="50%" 
                                   x2={`calc(50% + ${x}px)`} y2={`calc(50% + ${y}px)`} 
                                   stroke="rgba(79,70,229,0.4)" 
                                   strokeWidth="2" 
                                   strokeDasharray="5,5"
                                   className="animate-[shimmer_10s_infinite_linear]"
                                 />
                              </svg>
                              {/* Sub Node */}
                              <div 
                                style={{ transform: `translate(${x}px, ${y}px)` }}
                                className="absolute w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:border-indigo-500/50 transition-all group"
                              >
                                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                                 <span className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">🤖</span>
                                 <span className="text-[7px] font-black text-slate-500 mt-1 uppercase text-center px-1 leading-tight group-hover:text-indigo-400">
                                   {role.replace(/^The\s+/, '')}
                                 </span>
                              </div>
                            </React.Fragment>
                          );
                       })}
                    </div>
                    
                    <div className="absolute bottom-8 left-10 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">A2A_LINK_ACTIVE</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">MYCELIUM_SYNC_LOCKED</span>
                       </div>
                    </div>
                 </div>
              ) : activeTab === 'Monitoring' ? (
                <div className="flex-1 flex flex-col gap-8 animate-in zoom-in-95 duration-500 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                    {/* Charts */}
                    <div className="bg-slate-900/20 rounded-[2.5rem] border border-slate-800/40 p-10 flex flex-col gap-8">
                      <div className="flex items-center justify-between">
                        <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Node Telemetry (24h)</h6>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Compute</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">A2A</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monitoringData}>
                            <defs>
                              <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorA2a" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                            <XAxis dataKey="hour" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} interval={3} dy={10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ padding: '2px 0' }}
                            />
                            <Area type="monotone" dataKey="compute" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCompute)" dot={false} />
                            <Area type="monotone" dataKey="a2a" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorA2a)" dot={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Node Heatmap */}
                    <div className="bg-slate-900/20 rounded-[2.5rem] border border-slate-800/40 p-10 flex flex-col gap-8">
                       <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Distributed Node Heatmap</h6>
                       <div className="grid grid-cols-8 gap-2 flex-1">
                          {nodeHeatmap.map(node => (
                            <div 
                              key={node.id} 
                              className={`rounded-md transition-all duration-500 flex items-center justify-center group relative cursor-help ${node.active ? 'bg-indigo-500/20' : 'bg-slate-800/40'}`}
                            >
                               <div 
                                  className="w-full h-full rounded-md transition-all duration-700"
                                  style={{ 
                                    opacity: node.active ? node.load / 100 : 0.1,
                                    backgroundColor: node.load > 80 ? '#f43f5e' : node.load > 50 ? '#f59e0b' : '#6366f1'
                                  }}
                               ></div>
                               <div className="absolute hidden group-hover:block bg-slate-950 p-2 rounded border border-slate-800 z-10 text-[8px] font-mono text-white bottom-full mb-1">
                                  NODE_{node.id}<br/>LOAD: {node.load.toFixed(1)}%
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="flex justify-between items-center text-[8px] font-mono text-slate-600">
                          <span>LOW_LOAD</span>
                          <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-indigo-500 via-amber-500 to-rose-500 rounded-full"></div>
                          <span>MAX_LOAD</span>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full bg-slate-950/40 rounded-[2.5rem] border border-slate-800/60 overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-500">
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <div className="flex justify-start">
                      <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-3xl rounded-bl-none text-sm text-indigo-300 max-w-[85%] leading-relaxed font-medium shadow-lg">
                        <span className="block text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">POD_ORCHESTRATOR:</span>
                        Hypha Node ${selected.id} synchronized and listening at the Edge. Kernel state is nominal. How shall we optimize the digital empire protocol today?
                      </div>
                    </div>
                    {(chatHistory[selected.id] || []).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-5 rounded-3xl text-sm max-w-[85%] leading-relaxed font-medium ${
                          msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/20 shadow-xl' 
                          : 'bg-slate-900/80 text-slate-300 rounded-bl-none border border-slate-800 shadow-lg'
                        }`}>
                          {msg.role !== 'user' && <span className="block text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-40">POD_ORCHESTRATOR:</span>}
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900/60 p-5 rounded-3xl rounded-bl-none border border-slate-800/60">
                          <div className="flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s] transition-all"></span>
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest ml-2">Node Syncing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={consoleEndRef} />
                  </div>
                  <div className="p-6 bg-slate-950/80 border-t border-slate-800/60 space-y-4 backdrop-blur-md">
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {[
                        "Get current status",
                        "Optimize load balancing",
                        "Sync legal docs",
                        "A2A Traffic Audit"
                      ].map(cmd => (
                        <button 
                          key={cmd}
                          onClick={() => handleConsoleSend(cmd)}
                          disabled={isTyping}
                          className="whitespace-nowrap px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all disabled:opacity-50"
                        >
                          {cmd}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">⚡</div>
                        <input 
                          type="text" 
                          value={chatInput} 
                          onChange={(e) => setChatInput(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && handleConsoleSend()}
                          placeholder="Type command for pod orchestrator..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-inner group-hover:border-slate-700"
                        />
                      </div>
                      <button 
                        onClick={() => handleConsoleSend()} 
                        disabled={isTyping}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black transition-all disabled:opacity-50 uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
                      >
                        <span>EXECUTE</span>
                        <span className="text-sm">↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full glass rounded-[3rem] flex flex-col items-center justify-center text-slate-700 border border-slate-900/40 uppercase font-mono tracking-[0.8em] text-xs">
            <div className="w-20 h-20 mb-8 border-4 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
            Awaiting_Pod_Selection...
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
