
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gemini } from '../services/geminiService';
import { AgentRole, Blueprint } from '../types';

interface ArchitectModeProps {
  onSaveBlueprint: (blueprint: Blueprint) => void;
}

const ArchitectMode: React.FC<ArchitectModeProps> = ({ onSaveBlueprint }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Create Blueprint State
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintIndustry, setBlueprintIndustry] = useState('Property');
  const [blueprintIcon, setBlueprintIcon] = useState('🤖');
  const [selectedRoles, setSelectedRoles] = useState<AgentRole[]>([]);
  const [blueprintTier, setBlueprintTier] = useState<'Free' | 'Pro' | 'Enterprise'>('Free');
  const [blueprintInfra, setBlueprintInfra] = useState<'Edge Worker' | 'Cloud Pod' | 'Hybrid Nexus'>('Edge Worker');

  useEffect(() => {
    if (location.state?.initialPrompt) {
      setPrompt(location.state.initialPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [thinkingProcess]);

  const handleArchitect = async () => {
    if (!prompt.trim()) return;
    
    setIsArchitecting(true);
    setResult('');
    setShowSaveForm(false);
    
    const steps = [
      'INIT_ARCH_SESSION [HYPHA_v2.8]',
      'AUTHENTICATING_STARK_CREDENTIALS...',
      'MAPPING_REQUIREMENTS_PROMPT...',
      'INJECTING_MYCELIUM_ROOT_PROTOCOLS...',
      'CONFIGURING_RLS_POLICIES...',
      'SPAWNING_DISTRIBUTED_WORKER_NODES...',
      'DEEP_REASONING_ENGINE_ACTIVE...',
      'SYNTHESIZING_INVERSE_PYRAMID_SPEC...',
      'OPTIMIZING_A2A_LATENCY...'
    ];

    setThinkingProcess([]);
    
    // Add steps one by one for visual effect
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setThinkingProcess(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${steps[i]}`]);
    }

    try {
      const response = await gemini.architectEcosystem(prompt);
      setResult(response);
      setThinkingProcess(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] SUCCESS: ARCHITECTURE_LOCKED`]);
    } catch (e) {
      console.error(e);
      setResult('Failed to architect. The request may be too complex for the current thinking budget.');
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleSave = () => {
    if (!blueprintName.trim()) return;

    const dynamicFeatures = [
      ...selectedRoles.map(r => `${r.replace(/^The\s+/, '')} Intelligence Node`),
      'Custom AI Architecture',
      'Mycelium Integrated'
    ];

    const newBlueprint: Blueprint = {
      id: `custom-${Date.now()}`,
      name: blueprintName,
      industry: blueprintIndustry,
      description: result.substring(0, 300) + '...',
      features: dynamicFeatures.slice(0, 5),
      icon: blueprintIcon,
      roles: selectedRoles.length > 0 ? selectedRoles : [AgentRole.ORCHESTRATOR],
      price: blueprintTier === 'Free' ? '$0/mo' : blueprintTier === 'Pro' ? '$19/mo' : '$99/mo',
      tier: blueprintTier,
      infrastructure: blueprintInfra,
      reviews: [],
      deploymentCount: 0
    };

    onSaveBlueprint(newBlueprint);
    setShowSaveForm(false);
    alert('Legacy Pod Blueprint Synchronized to Marketplace! Gyss!');
    navigate('/');
  };

  const toggleRole = (role: AgentRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const clearRoles = () => setSelectedRoles([]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tight">Ecosystem Architect</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Utilize <span className="text-indigo-400 font-mono">gemini-3-pro-preview</span> with Maximum Reasoning Depth to design custom agentic infrastructures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Requirements Prompt</label>
                {location.state?.initialPrompt && (
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">SPEC_TEMPLATE_LOADED</span>
                )}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Build a decentralized hedge fund management ecosystem with risk analysts..."
                className="w-full h-48 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner"
              />
            </div>

            <button
              onClick={handleArchitect}
              disabled={isArchitecting || !prompt}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {isArchitecting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Reasoning...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Generate Architecture
                </>
              )}
            </button>

            {isArchitecting && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Hypha Thinking Terminal</p>
                <div 
                  ref={terminalRef}
                  className="bg-black/40 rounded-xl p-4 h-32 overflow-y-auto scrollbar-hide font-mono text-[9px] text-indigo-400/80 border border-slate-800"
                >
                  {thinkingProcess.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="text-slate-800 shrink-0">#</span>
                      {step}
                    </div>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            )}
          </div>

          {result && !showSaveForm && (
            <div className="glass rounded-3xl p-8 border border-indigo-500/20 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-4">
                <div className="text-3xl">🧩</div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Sync this Architecture?</h4>
                <p className="text-slate-400 text-sm">Convert this design into a reusable Legacy Pod Blueprint. Gyss!</p>
                <button 
                  onClick={() => setShowSaveForm(true)}
                  className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Create Blueprint
                </button>
              </div>
            </div>
          )}

          {showSaveForm && (
            <div className="glass rounded-3xl p-8 space-y-6 border border-emerald-500/30 animate-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-white uppercase tracking-tight">Blueprint Designer</h4>
                <button onClick={() => setShowSaveForm(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pod Name</label>
                  <input 
                    type="text" 
                    value={blueprintName}
                    onChange={(e) => setBlueprintName(e.target.value)}
                    placeholder="Enter pod name..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Icon (Emoji)</label>
                  <input 
                    type="text" 
                    value={blueprintIcon}
                    onChange={(e) => setBlueprintIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white text-center focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Industry</label>
                <select 
                  value={blueprintIndustry}
                  onChange={(e) => setBlueprintIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option>Property</option>
                  <option>Personal Services</option>
                  <option>Lifestyle</option>
                  <option>Content Creation</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Orchestration Roles</label>
                  <button onClick={clearRoles} className="text-[9px] text-slate-500 hover:text-red-400 font-bold uppercase tracking-tighter">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(AgentRole).map(role => {
                    const label = role.replace(/^The\s+/, '');
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-2 ${
                          isSelected 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Tier</label>
                  <select value={blueprintTier} onChange={(e) => setBlueprintTier(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none">
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Infrastructure</label>
                  <select value={blueprintInfra} onChange={(e) => setBlueprintInfra(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none">
                    <option value="Edge Worker">Edge Worker</option>
                    <option value="Cloud Pod">Cloud Pod</option>
                    <option value="Hybrid Nexus">Hybrid Nexus</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!blueprintName || selectedRoles.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                Sync to Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="glass rounded-[2rem] p-10 bg-slate-900/20 relative overflow-hidden flex flex-col min-h-[600px] border border-slate-800">
          <div className="absolute top-0 right-0 p-6 flex gap-2">
            <span className="text-[10px] font-mono text-slate-700 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 uppercase tracking-widest font-black">Output: ARCH_SPEC_v2</span>
          </div>
          
          <div className="flex-1 mt-12 overflow-y-auto pr-4 scrollbar-hide">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-400 leading-relaxed p-6 bg-black/20 rounded-3xl border border-slate-800/40">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-24">
                <div className="text-6xl mb-6">🏗️</div>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] font-black">Awaiting_Architectural_Blueprints...</p>
                <p className="text-[9px] mt-4 max-w-[240px] leading-relaxed uppercase tracking-widest">Define your vision to witness the Hypha Engine's deep structural reasoning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectMode;
