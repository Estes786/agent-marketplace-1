
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BLUEPRINTS } from './constants';
import { DeployedEcosystem, Blueprint } from './types';
import GaniAssistant from './components/GaniAssistant';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import ArchitectMode from './components/ArchitectMode';
import MediaLab from './components/MediaLab';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BLUEPRINTS);
  const [deployedEcosystems, setDeployedEcosystems] = useState<DeployedEcosystem[]>([]);
  const [credits, setCredits] = useState(2500);
  const [isGaniOpen, setIsGaniOpen] = useState(false);
  const [deployingIds, setDeployingIds] = useState<string[]>([]);

  const handleDeploy = (blueprint: Blueprint) => {
    const cost = blueprint.tier === 'Enterprise' ? 500 : blueprint.tier === 'Pro' ? 150 : 0;
    
    if (credits < cost) {
      alert(`Insufficient HYPHA credits. Sync required. Need ${cost} but have ${credits}. Gyss!`);
      return;
    }

    setCredits(prev => prev - cost);
    setDeployingIds(prev => [...prev, blueprint.id]);

    // Increment deployment count
    setBlueprints(prev => prev.map(b => 
      b.id === blueprint.id 
        ? { ...b, deploymentCount: b.deploymentCount + 1 } 
        : b
    ));

    const newEcosystem: DeployedEcosystem = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      blueprintId: blueprint.id,
      name: `${blueprint.name}`,
      status: 'Syncing',
      deployedAt: new Date().toISOString(),
      logs: [
        `Initiating Hypha Engine Master... Gyss!`,
        `Allocating ${blueprint.infrastructure} resources...`,
        `Establishing secure Mycelium Tunnel...`
      ],
      metrics: {
        computeUsage: '0ms',
        a2aActivity: '0',
        stateSize: '0KB',
        nodeHealth: 0
      }
    };
    
    setDeployedEcosystems(prev => [...prev, newEcosystem]);
    setIsGaniOpen(true);

    // After a brief delay to show "Syncing" state, navigate to dashboard
    setTimeout(() => {
      setDeployingIds(prev => prev.filter(id => id !== blueprint.id));
      setDeployedEcosystems(prev => 
        prev.map(e => e.id === newEcosystem.id ? { 
          ...e, 
          status: 'Active', 
          logs: [...e.logs, `Kernel Synchronized. Legacy Pod '${newEcosystem.name}' is now autonomous!`],
          metrics: { ...e.metrics, nodeHealth: 100 }
        } : e)
      );
      // Navigate to Command Center and focus on the new pod
      navigate(`/dashboard?podId=${newEcosystem.id}`);
    }, 2000);
  };

  const handleSaveBlueprint = (newBlueprint: Blueprint) => {
    setBlueprints(prev => [newBlueprint, ...prev]);
  };

  const handleUpdateBlueprint = (updatedBlueprint: Blueprint) => {
    setBlueprints(prev => prev.map(b => b.id === updatedBlueprint.id ? updatedBlueprint : b));
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      <Sidebar deployedCount={deployedEcosystems.length} />
      
      <div className="flex-1 flex flex-col h-screen relative">
        <Header credits={credits} activePodsCount={deployedEcosystems.length} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <Routes>
            <Route path="/" element={
              <Marketplace 
                blueprints={blueprints} 
                credits={credits} 
                onDeploy={handleDeploy} 
                onUpdateBlueprint={handleUpdateBlueprint}
                deployingIds={deployingIds}
                deployedEcosystems={deployedEcosystems}
              />
            } />
            <Route path="/dashboard" element={<Dashboard ecosystems={deployedEcosystems} blueprints={blueprints} />} />
            <Route path="/architect" element={<ArchitectMode onSaveBlueprint={handleSaveBlueprint} />} />
            <Route path="/media-lab" element={<MediaLab />} />
          </Routes>
        </main>
        
        <GaniAssistant isOpen={isGaniOpen} setIsOpen={setIsGaniOpen} />
      </div>
    </div>
  );
};

export default App;
