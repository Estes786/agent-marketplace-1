
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Blueprint, Review, AgentRole, DeployedEcosystem } from '../types';
import { gemini, Trend } from '../services/geminiService';

interface MarketplaceProps {
  blueprints: Blueprint[];
  credits: number;
  onDeploy: (blueprint: Blueprint) => void;
  onUpdateBlueprint: (blueprint: Blueprint) => void;
  deployingIds?: string[];
  deployedEcosystems?: DeployedEcosystem[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ 
  blueprints, 
  credits, 
  onDeploy, 
  onUpdateBlueprint,
  deployingIds = [],
  deployedEcosystems = []
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('All');
  const [activeTier, setActiveTier] = useState('All');
  const [activeInfra, setActiveInfra] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isLoadingBlueprints, setIsLoadingBlueprints] = useState(true);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingBlueprints(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', 'Featured', 'Property', 'Personal Services', 'Lifestyle', 'Content Creation'];
  const tiers = ['All', 'Free', 'Pro', 'Enterprise'];
  const infras = ['All', 'Edge Worker', 'Cloud Pod', 'Hybrid Nexus'];

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const result = await gemini.getMarketTrends(activeTab === 'All' || activeTab === 'Featured' ? 'Artificial Intelligence' : activeTab);
      setTrends(result.trends);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [activeTab]);

  const handleQuickDeploy = (trend: Trend) => {
    const content = `${trend.title} ${trend.description}`.toLowerCase();
    
    // Find the best matching blueprint based on keyword overlap
    const scores = blueprints.map(bp => {
      let score = 0;
      if (content.includes(bp.industry.toLowerCase())) score += 15;
      const nameParts = bp.name.toLowerCase().split(' ');
      nameParts.forEach(part => {
        if (part.length > 3 && content.includes(part)) score += 8;
      });
      bp.features?.forEach(feat => {
        if (content.includes(feat.toLowerCase())) score += 5;
      });
      if (bp.isFeatured) score += 2;
      return { id: bp.id, score };
    });

    const best = scores.sort((a, b) => b.score - a.score)[0];
    const matched = blueprints.find(bp => bp.id === best.id) || blueprints[0];
    
    if (matched) {
      onDeploy(matched);
    }
  };

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleArchitectFromBlueprint = (e: React.MouseEvent, blueprint: Blueprint) => {
    e.stopPropagation();
    const initialPrompt = `Base Blueprint: ${blueprint.name}\nIndustry: ${blueprint.industry}\nInfrastructure: ${blueprint.infrastructure}\nRoles: ${blueprint.roles.join(', ')}\n\nDescription: ${blueprint.description}\n\nRequirement: I want to extend this ecosystem to include...`;
    navigate('/architect', { state: { initialPrompt } });
  };

  const handleShare = async (e: React.MouseEvent, blueprint: Blueprint) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/?bp=${blueprint.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `GANI HYPHA - ${blueprint.name}`, url: shareUrl });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    }
  };

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(blueprint => {
      const matchesTab = activeTab === 'All' || (activeTab === 'Featured' ? blueprint.isFeatured : blueprint.industry === activeTab);
      const matchesTier = activeTier === 'All' || blueprint.tier === activeTier;
      const matchesInfra = activeInfra === 'All' || blueprint.infrastructure === activeInfra;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = blueprint.name.toLowerCase().includes(searchLower) || blueprint.description.toLowerCase().includes(searchLower);
      return matchesTab && matchesTier && matchesInfra && matchesSearch;
    });
  }, [activeTab, activeTier, activeInfra, searchQuery, blueprints]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <style>{`
        .card-highlight { border-color: rgba(99, 102, 241, 0.8) !important; box-shadow: 0 0 25px rgba(99, 102, 241, 0.4) !important; transform: translateY(-4px); }
        .blueprint-card:hover .quick-specs { transform: translateY(0); opacity: 1; }
        .quick-specs { transform: translateY(10px); opacity: 0; transition: all 0.3s ease; }
        @keyframes pulse-indigo {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .pulse-btn { animation: pulse-indigo 2s infinite; }
      `}</style>

      {showCopyToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3 border border-emerald-400/20 backdrop-blur-md">
          <span className="text-lg">🔗</span> Blueprint Sync Complete
        </div>
      )}

      {/* Top Banner: Grounding Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Hypha Grounding Engine <span className="text-indigo-500 font-mono">v2.1</span>
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('Featured')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'Featured' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>⭐ Featured</button>
            <button onClick={fetchTrends} className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest flex items-center gap-2 transition-all">{isLoadingTrends ? 'Grounding...' : 'Sync Trends'}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingTrends ? Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>) : trends.map((trend, i) => {
            const isProvisioning = blueprints.some(bp => bp.name.toLowerCase().includes(trend.title.toLowerCase()) && deployingIds.includes(bp.id));
            return (
              <div key={i} className="glass rounded-2xl p-4 border border-indigo-500/10 hover:border-indigo-400/30 transition-all group flex flex-col justify-between">
                 <div>
                   <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="text-sm font-bold text-white truncate flex-1">{trend.title}</h4>
                      <button 
                        onClick={() => handleQuickDeploy(trend)} 
                        disabled={isProvisioning}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 rounded-lg shrink-0 group/btn ${isProvisioning ? '' : 'pulse-btn'}`}
                      >
                        <span className={isProvisioning ? 'animate-spin' : 'group-hover/btn:scale-125 transition-transform'}>
                          {isProvisioning ? '🔄' : '⚡'}
                        </span>
                        {isProvisioning ? 'Syncing...' : 'Quick Deploy'}
                      </button>
                   </div>
                   <p className="text-[10px] text-slate-400 line-clamp-2 h-6 mb-3">{trend.description}</p>
                 </div>
                 <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${trend.impact}%` }}></div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>{cat}</button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-[2rem] border border-slate-800/60">
          <div className="flex flex-wrap gap-6 items-center flex-1 w-full">
            <div className="relative w-full md:w-64">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search legacy pods..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-[11px] text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
              <span className="absolute left-3 top-3 text-slate-600 text-xs">🔍</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Subscription Tier</span>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60">
                {tiers.map(t => <button key={t} onClick={() => setActiveTier(t)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${activeTier === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600 hover:text-slate-300'}`}>{t}</button>)}
              </div>
            </div>
            {compareList.length > 0 && (
              <div className="ml-auto flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{compareList.length} In Comparison</span>
                <button onClick={() => setCompareList([])} className="text-[9px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest">Reset</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blueprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoadingBlueprints ? Array(6).fill(0).map((_, i) => <div key={i} className="h-[420px] glass rounded-[2.5rem] border border-slate-800 animate-pulse"></div>) : filteredBlueprints.map(blueprint => {
          const isComparing = compareList.includes(blueprint.id);
          const isProvisioning = deployingIds.includes(blueprint.id);
          const deployedPod = deployedEcosystems.find(de => de.blueprintId === blueprint.id);

          return (
            <div 
              key={blueprint.id} 
              onClick={() => setSelectedBlueprint(blueprint)}
              className={`glass rounded-[2.5rem] p-8 flex flex-col group transition-all cursor-pointer relative overflow-hidden border blueprint-card ${
                isProvisioning ? 'border-indigo-500/80 animate-pulse' : (blueprint.isFeatured ? 'border-indigo-500/40 shadow-2xl shadow-indigo-600/5' : 'border-slate-800/60 hover:border-slate-700')
              }`}
            >
              <div className="absolute top-0 right-0 p-4 flex gap-2">
                 <button onClick={(e) => toggleCompare(e, blueprint.id)} className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center text-[10px] ${isComparing ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-600 hover:text-white'}`} title="Compare Node">⚖️</button>
                 <button onClick={(e) => handleShare(e, blueprint)} className="w-8 h-8 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-[10px] text-slate-600 hover:text-white transition-all">📤</button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                  {blueprint.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${blueprint.tier === 'Enterprise' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>{blueprint.tier}</span>
                  <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">{blueprint.infrastructure}</span>
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                {blueprint.name}
                {deployedPod && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
              </h4>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 mb-6">{blueprint.description}</p>
              
              <div className="quick-specs grid grid-cols-2 gap-3 mb-6">
                {blueprint.roles.slice(0, 2).map(r => (
                  <div key={r} className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/40 text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full"></span> {r.replace(/^The\s+/, '')}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-900/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Total Deployed</span>
                  <span className="text-xs font-mono font-bold text-white">{blueprint.deploymentCount.toLocaleString()} Units</span>
                </div>
                <div className="flex items-center gap-2">
                  {deployedPod ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard?podId=${deployedPod.id}`); }}
                      className="px-6 py-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-2"
                    >
                      Monitor Node
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => handleArchitectFromBlueprint(e, blueprint)}
                        className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-[10px] transition-all"
                        title="Extend Infrastructure"
                      >🏗️</button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeploy(blueprint); }}
                        disabled={isProvisioning}
                        className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/10 active:scale-95 ${isProvisioning ? 'opacity-50 grayscale cursor-wait' : ''}`}
                      >
                        {isProvisioning ? 'Provisioning...' : 'Instantiate'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Drawer / Summary (Optional enhancement) */}
      {compareList.length > 1 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-3xl border border-indigo-500/30 shadow-3xl z-40 animate-in slide-in-from-bottom-8 flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Node Comparison Layer</span>
              <span className="text-sm font-bold text-white">{compareList.length} Specifications Selected</span>
           </div>
           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Generate Diff Report</button>
        </div>
      )}

      {/* Selected Blueprint Detail Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto">
          <div className="glass w-full max-w-2xl rounded-[3rem] my-8 overflow-hidden border border-slate-800/60 shadow-3xl flex flex-col">
            <div className="p-12 border-b border-slate-800/40 relative bg-gradient-to-br from-indigo-950/20 via-transparent to-transparent">
              <button onClick={() => setSelectedBlueprint(null)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors text-xl">✕</button>
              <div className="flex items-center gap-10">
                <div className="w-28 h-28 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-6xl shadow-2xl">
                  {selectedBlueprint.icon}
                </div>
                <div className="flex-1">
                   <h3 className="text-4xl font-bold text-white tracking-tight mb-2">{selectedBlueprint.name}</h3>
                   <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-xl border border-indigo-500/20 uppercase">{selectedBlueprint.industry}</span>
                      <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/20 uppercase">{selectedBlueprint.infrastructure}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="p-12 space-y-10 overflow-y-auto flex-1 custom-scrollbar">
              <div>
                <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Functional Matrix</h4>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{selectedBlueprint.description}</p>
              </div>

              {selectedBlueprint.features && (
                <div className="grid grid-cols-2 gap-4">
                   {selectedBlueprint.features.map(f => (
                     <div key={f} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/40 flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-xs text-slate-300 font-bold">{f}</span>
                     </div>
                   ))}
                </div>
              )}

              <div className="pt-8 border-t border-slate-800/40">
                <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Orchestration Roles</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedBlueprint.roles.map(role => (
                    <span key={role} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400">{role}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-12 border-t border-slate-800/60 bg-slate-950/40 flex gap-4">
               <button onClick={(e) => handleArchitectFromBlueprint(e, selectedBlueprint)} className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-3xl font-black uppercase tracking-widest transition-all">Extend Spec</button>
               <button 
                onClick={() => { setSelectedBlueprint(null); onDeploy(selectedBlueprint); }} 
                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20"
               >
                Instantiate Pod
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
