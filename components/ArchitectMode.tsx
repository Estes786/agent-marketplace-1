
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
  const [depthPercent, setDepthPercent] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  
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
    setDepthPercent(0);
    
    const steps = [
      'INIT_ARCH_SESSION_v3.2 [STARK_KERNEL]',
      'AUTHENTICATING_USER_CREDENTIALS...',
      'MAPPING_REQUIREMENTS_PROMPT...',
      'HYPHA_GROUNDING_ENGINE_SYNCING...',
      'INJECTING_MYCELIUM_ROOT_PROTOCOLS...',
      'EVALUATING_A2A_ORCHESTRATION_LOAD...',
      'CONFIGURING_RLS_POLICIES_IN_VAULT...',
      'SPAWNING_DISTRIBUTED_WORKER_NODES...',
      'DEEP_REASONING_ENGINE_ACTIVE [GEMINI_3_PRO]...',
      'SYNTHESIZING_INVERSE_PYRAMID_SPEC...',
      'OPTIMIZING_A2A_LATENCY...',
      'ARCHITECTURE_LOCKED_AND_VERIFIED'
    ];

    setThinkingProcess([]);
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, Math.random() * 400 + 200));
      setThinkingProcess(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${steps[i]}`]);
      setDepthPercent(Math.round(((i + 1) / steps.length) * 100));
    }

    try {
      const response = await gemini.architectEcosystem(prompt);
      setResult(response);
    } catch (e) {
      console.error(e);
      setResult('Failed to architect. The Mycelium link was severed. Gyss! Check thinking budget.');
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleSave = () => {
    if (!blueprintName.trim()) return;

    const dynamicFeatures = [
      ...selectedRoles.map(r => `${r.replace(/^The\s+/, '')} Optimization`),
      'Full Stack OaaS Deployment',
      'Hypha Engine Integrated'
    ];

    const newBlueprint: Blueprint = {
      id: `custom-${Date.now()}`,
      name: blueprintName,
      industry: blueprintIndustry,
      description: result.substring(0, 400) + '...',
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
    alert('Legacy Pod Blueprint Synchronized! Gyss!');
    navigate('/');
  };

  const toggleRole = (role: AgentRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Ecosystem Architect</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium tracking-wide">
          Define your empire's vision. Utilize the <span className="text-indigo-400 font-mono">Mycelium Reasoning Engine</span> to synthesize standalone OaaS infrastructures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass rounded-[2.5rem] p-10 space-y-8 border border-slate-800 shadow-3xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Requirement Specification</label>
                {location.state?.initialPrompt && (
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-black">POD_TEMPLATE_LOADED</span>
                )}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your autonomous system... e.g., A multi-agent network for private property wealth management with legal grounding."
                className="w-full h-56 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-inner font-medium text-sm leading-relaxed"
              />
            </div>

            <button
              onClick={handleArchitect}
              disabled={isArchitecting || !prompt}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-indigo-600/20 active:scale-95 group"
            >
              {isArchitecting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synthesizing Architecture...
                </>
              ) : (
                <>
                  <span className="group-hover:rotate-12 transition-transform">⚡</span>
                  Generate Autonomous Spec
                </>
              )}
            </button>

            {isArchitecting && (
              <div className="space-y-4 animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center px-1">
                  <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">Hypha Thinking Thread</p>
                  <span className="text-[10px] font-mono text-indigo-300">{depthPercent}% Depth</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${depthPercent}%` }}></div>
                </div>
                <div 
                  ref={terminalRef}
                  className="bg-[#020617] rounded-2xl p-6 h-48 overflow-y-auto scrollbar-hide font-mono text-[10px] text-indigo-400/80 border border-slate-800/60 shadow-inner"
                >
                  {thinkingProcess.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2 opacity-80 hover:opacity-100 transition-opacity">
                      <span className="text-slate-800 shrink-0">root@hypha:~$</span>
                      {step}
                    </div>
                  ))}
                  <div className="animate-pulse inline-block w-2 h-4 bg-indigo-500/50 align-middle ml-1"></div>
                </div>
              </div>
            )}
          </div>

          {result && !showSaveForm && (
            <div className="glass rounded-[2rem] p-10 border border-indigo-500/30 animate-in zoom-in-95 duration-500 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="text-5xl">🧬</div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Architecture Locked</h4>
                <p className="text-slate-400 text-sm font-medium">This design is optimized for the Hypha Engine. Synchronize as a Marketplace Blueprint? Gyss!</p>
                <button 
                  onClick={() => setShowSaveForm(true)}
                  className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Sync to Marketplace
                </button>
              </div>
            </div>
          )}

          {showSaveForm && (
            <div className="glass rounded-[2.5rem] p-10 space-y-8 border border-emerald-500/30 animate-in slide-in-from-left-4 duration-500 shadow-3xl">
              <div className="flex justify-between items-center">
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Blueprint Designer</h4>
                <button onClick={() => setShowSaveForm(false)} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pod Identity</label>
                  <input 
                    type="text" 
                    value={blueprintName}
                    onChange={(e) => setBlueprintName(e.target.value)}
                    placeholder="E.g. Nexus_Admin_v1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Core Icon</label>
                  <input 
                    type="text" 
                    value={blueprintIcon}
                    onChange={(e) => setBlueprintIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white text-center focus:ring-1 focus:ring-indigo-500 outline-none text-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Industry Cluster</label>
                <select 
                  value={blueprintIndustry}
                  onChange={(e) => setBlueprintIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none appearance-none"
                >
                  <option>Property</option>
                  <option>Personal Services</option>
                  <option>Lifestyle</option>
                  <option>Content Creation</option>
                  <option>Fintech</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block px-1">Orchestration Roles</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(AgentRole).map(role => {
                    const label = role.replace(/^The\s+/, '');
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                          isSelected 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!blueprintName || selectedRoles.length === 0}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-xl transition-all shadow-2xl shadow-emerald-600/20 disabled:opacity-50 active:scale-95"
              >
                Launch Marketplace Node
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Spec Viewer */}
        <div className="glass rounded-[2.5rem] p-12 bg-slate-900/20 relative overflow-hidden flex flex-col min-h-[700px] border border-slate-800 shadow-inner">
          <div className="absolute top-0 right-0 p-8 flex gap-2">
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-4 py-2 rounded-2xl border border-indigo-500/20 uppercase tracking-widest font-black">Architecture_Output::STABLE</span>
          </div>
          
          <div className="flex-1 mt-10 overflow-y-auto pr-4 custom-scrollbar">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-300 leading-relaxed p-8 bg-black/40 rounded-[2rem] border border-slate-800/60 shadow-inner backdrop-blur-sm">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-12">
                <div className="text-8xl mb-8 grayscale animate-pulse">🏛️</div>
                <p className="font-mono text-xs uppercase tracking-[0.6em] font-black mb-4">Awaiting_Signal...</p>
                <p className="text-[10px] max-w-[300px] leading-relaxed uppercase tracking-widest font-medium">Initiate architectural synthesis to witness the Mycelium Engine's deep structural reasoning layer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectMode;
