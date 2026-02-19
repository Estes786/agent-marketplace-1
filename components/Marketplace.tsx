
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Blueprint, Review, AgentRole } from '../types';
import { gemini, Trend } from '../services/geminiService';

interface MarketplaceProps {
  blueprints: Blueprint[];
  credits: number;
  onDeploy: (blueprint: Blueprint) => void;
  onUpdateBlueprint: (blueprint: Blueprint) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ blueprints, credits, onDeploy, onUpdateBlueprint }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('All');
  const [activeTier, setActiveTier] = useState('All');
  const [activeInfra, setActiveInfra] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);

  // Deep-linking: check for blueprint ID in URL on mount
  useEffect(() => {
    const bpId = searchParams.get('bp');
    if (bpId) {
      const found = blueprints.find(b => b.id === bpId);
      if (found) {
        setSelectedBlueprint(found);
      }
    }
  }, [searchParams, blueprints]);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Blueprint | null>(null);

  // Local state for reviews
  const [blueprintReviews, setBlueprintReviews] = useState<Record<string, Review[]>>(() => {
    const initial: Record<string, Review[]> = {};
    blueprints.forEach(b => {
      initial[b.id] = b.reviews;
    });
    return initial;
  });

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

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

  const handleStartArchitecting = (blueprint: Blueprint) => {
    const prompt = `Architect a highly scalable ${blueprint.industry} ecosystem based on the '${blueprint.name}' legacy pod. Orchestrate these roles: ${blueprint.roles.join(', ')}. Target capabilities: ${blueprint.description}`;
    navigate('/architect', { state: { initialPrompt: prompt } });
  };

  const handleShare = async (e: React.MouseEvent, blueprint: Blueprint) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/?bp=${blueprint.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GANI HYPHA - ${blueprint.name}`,
          text: `Check out this autonomous ${blueprint.industry} pod on the Hypha Engine!`,
          url: shareUrl,
        });
      } catch (err: any) {
        // "AbortError" means user canceled, which isn't a functional error we need to log as failure
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Blueprint link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const getImpactMeaning = (impact: number) => {
    if (impact >= 90) return "Paradigm Shift: Projected to fundamentally automate core value chains via autonomous micro-nodes.";
    if (impact >= 70) return "Holy Grail: Major strategic disruption. Significant 10x gains in operational throughput.";
    if (impact >= 50) return "Operational Evolution: Notable efficiency improvements via the YKK strategy.";
    if (impact >= 30) return "Targeted Optimization: Precision gains in specific high-value workflows.";
    return "Baseline Influence: Incremental improvements to existing digital twins.";
  };

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(blueprint => {
      const matchesTab = activeTab === 'All' || (activeTab === 'Featured' ? blueprint.isFeatured : blueprint.industry === activeTab);
      const matchesTier = activeTier === 'All' || blueprint.tier === activeTier;
      const matchesInfra = activeInfra === 'All' || blueprint.infrastructure === activeInfra;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        blueprint.name.toLowerCase().includes(searchLower) ||
        blueprint.description.toLowerCase().includes(searchLower) ||
        blueprint.roles.some(role => role.toLowerCase().includes(searchLower));
      return matchesTab && matchesTier && matchesInfra && matchesSearch;
    });
  }, [activeTab, activeTier, activeInfra, searchQuery, blueprints]);

  const getAverageRating = (id: string) => {
    const reviews = blueprintReviews[id] || [];
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleSubmitReview = (blueprintId: string) => {
    if (!newComment.trim()) return;
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: 'STARK_ADMIN',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    setBlueprintReviews(prev => ({
      ...prev,
      [blueprintId]: [review, ...(prev[blueprintId] || [])]
    }));
    setNewComment('');
    setNewRating(5);
  };

  const handleEditClick = () => {
    if (selectedBlueprint) {
      setEditForm({ ...selectedBlueprint });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateBlueprint(editForm);
      setSelectedBlueprint(editForm);
      setIsEditing(false);
      setEditForm(null);
    }
  };

  const toggleRoleInEdit = (role: AgentRole) => {
    if (!editForm) return;
    const roles = editForm.roles.includes(role)
      ? editForm.roles.filter(r => r !== role)
      : [...editForm.roles, role];
    setEditForm({ ...editForm, roles });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              Hypha Grounding Engine <span className="text-indigo-500 font-mono">v2.1</span>
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-400 uppercase">Available:</span>
              <span className="text-xs font-mono font-bold text-white">{credits} HYPHA</span>
            </div>
            <button onClick={fetchTrends} className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest flex items-center gap-2 transition-all">
              {isLoadingTrends ? 'Grounding...' : 'Sync Global Trends'}
              <span className={isLoadingTrends ? 'animate-spin' : ''}>🔄</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingTrends ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))
          ) : trends.length > 0 ? (
            trends.map((trend, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-indigo-500/10 hover:border-indigo-400/30 transition-all group relative overflow-visible">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-white truncate pr-2">{trend.title}</h4>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{trend.growth}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 h-8">{trend.description}</p>
                  <div className="space-y-1.5 group/impact relative">
                    <div className="flex justify-between text-[9px] uppercase tracking-tighter text-slate-500 font-bold group-hover/impact:text-indigo-300 transition-colors">
                      <span>Market Impact</span>
                      <span className="text-indigo-400 font-mono">{trend.impact}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-help relative shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000 ease-out" 
                        style={{ width: `${trend.impact}%` }}
                      ></div>
                    </div>
                    <div className="absolute bottom-full left-0 mb-3 w-64 p-3 bg-slate-900 border border-indigo-500/40 rounded-xl shadow-2xl hidden group-hover/impact:block z-50 animate-in fade-in slide-in-from-bottom-1 duration-200 pointer-events-none">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Impact Analysis</span>
                        <span className="text-xs font-mono font-bold text-white bg-indigo-500/20 px-1.5 rounded">{trend.impact}%</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed italic">
                        "{getImpactMeaning(trend.impact)}"
                      </p>
                      <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-900 border-r border-b border-indigo-500/40 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'}`}>{cat}</button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap gap-6 items-center flex-1">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legacy pods..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tier</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                {tiers.map(t => (
                  <button 
                    key={t} 
                    onClick={() => setActiveTier(t)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activeTier === t ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">Node</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                {infras.map(infra => (
                  <button 
                    key={infra} 
                    onClick={() => setActiveInfra(infra)}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all whitespace-nowrap ${activeInfra === infra ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {infra}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest border-l border-slate-800 pl-4 hidden lg:block">
            {filteredBlueprints.length} Nodes Found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlueprints.length > 0 ? (
          filteredBlueprints.map(blueprint => {
            const cost = blueprint.tier === 'Enterprise' ? 500 : blueprint.tier === 'Pro' ? 150 : 0;
            const canAfford = credits >= cost;

            return (
              <div 
                key={blueprint.id} 
                onClick={() => { setSelectedBlueprint(blueprint); setIsEditing(false); }} 
                className={`glass rounded-3xl p-6 flex flex-col group transition-all cursor-pointer relative overflow-hidden border ${
                  blueprint.isFeatured ? 'border-indigo-500/60 shadow-lg' : 'hover:border-indigo-500/50 border-slate-800'
                }`}
              >
                <div className="absolute top-0 right-0 flex items-start z-10">
                  <button 
                    onClick={(e) => handleShare(e, blueprint)}
                    className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-900/40 rounded-bl-xl border-b border-l border-white/5"
                    title="Share Blueprint"
                  >
                    📤
                  </button>
                  {blueprint.isFeatured && (
                    <div className="bg-indigo-600 text-[8px] font-black text-white px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-lg ml-px">
                      <span className="w-1 h-1 bg-white rounded-full animate-ping"></span>
                      Featured
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-6 relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border ${blueprint.isFeatured ? 'bg-indigo-900/40 border-indigo-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    {blueprint.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${blueprint.tier === 'Enterprise' ? 'text-amber-500' : blueprint.tier === 'Pro' ? 'text-indigo-400' : 'text-slate-500'}`}>{blueprint.tier}</span>
                    <span className="text-[8px] font-mono text-slate-600 uppercase">{blueprint.infrastructure}</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {blueprint.name}
                </h4>
                <p className="text-slate-400 text-xs mb-6 line-clamp-3">{blueprint.description}</p>
                <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Sync Cost</span>
                      <span className={`text-lg font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>{cost} HYPHA</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeploy(blueprint); }}
                      disabled={!canAfford}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                    >
                      Spawn
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-3xl border border-slate-800/50">
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">No nodes found</p>
          </div>
        )}
      </div>

      {selectedBlueprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="glass w-full max-w-2xl rounded-[2.5rem] my-8 overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            <div className="p-10 border-b border-slate-800 relative bg-gradient-to-br from-indigo-900/20 via-transparent to-transparent shrink-0">
              <button onClick={() => { setSelectedBlueprint(null); setIsEditing(false); setSearchParams({}); }} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">✕</button>
              
              {!isEditing ? (
                <div className="flex items-center gap-8 mb-4">
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border ${selectedBlueprint.isFeatured ? 'bg-indigo-900/50 border-indigo-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    {selectedBlueprint.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-3xl font-bold text-white">{selectedBlueprint.name}</h3>
                      {selectedBlueprint.isFeatured && (
                        <span className="bg-indigo-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase">Featured</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={(e) => handleShare(e, selectedBlueprint)} className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest">📤 Share</button>
                      <button onClick={handleEditClick} className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase tracking-widest">✏️ Edit</button>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 rounded-md">ID: {selectedBlueprint.id}</span>
                      <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 rounded-md">{selectedBlueprint.infrastructure}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center text-4xl">
                    <input type="text" value={editForm?.icon} onChange={(e) => setEditForm(prev => prev ? { ...prev, icon: e.target.value } : null)} className="w-full h-full bg-transparent text-center focus:outline-none" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="text" value={editForm?.name} onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-xl outline-none" placeholder="Pod Name" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-10 space-y-10 overflow-y-auto">
              {!isEditing ? (
                <>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Capabilities</h4>
                    <p className="text-slate-300 leading-relaxed text-sm">{selectedBlueprint.description}</p>
                  </div>
                  {selectedBlueprint.features && selectedBlueprint.features.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedBlueprint.features.map(f => (
                          <div key={f} className="flex items-center gap-3 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                            <span className="text-xs font-medium text-slate-300">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">User Reviews</h4>
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setNewRating(s)} className={`text-xl ${newRating >= s ? 'grayscale-0' : 'grayscale'}`}>⭐</button>
                        ))}
                      </div>
                      <div className="relative">
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Review..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none resize-none h-24" />
                        <button onClick={() => handleSubmitReview(selectedBlueprint.id)} className="absolute bottom-3 right-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-bold">POST</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Industry</label>
                    <select value={editForm?.industry} onChange={(e) => setEditForm(prev => prev ? { ...prev, industry: e.target.value } : null)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none">
                      {categories.filter(c => c !== 'All' && c !== 'Featured').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Description</label>
                    <textarea value={editForm?.description} onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none h-32 resize-none" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-10 border-t border-slate-800 bg-slate-950/50 flex gap-4 shrink-0">
              {!isEditing ? (
                <>
                  <button onClick={() => onDeploy(selectedBlueprint)} disabled={credits < (selectedBlueprint.tier === 'Enterprise' ? 500 : selectedBlueprint.tier === 'Pro' ? 150 : 0)} className="flex-1 py-4 bg-white text-slate-950 rounded-2xl font-bold transition-all disabled:opacity-50">Spawn Pod</button>
                  <button onClick={() => handleStartArchitecting(selectedBlueprint)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2">🏗️ Architect</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold">Cancel</button>
                  <button onClick={handleSaveEdit} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold">Save</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
