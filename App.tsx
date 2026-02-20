
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BLUEPRINTS } from './constants';
import { DeployedEcosystem, Blueprint, UserStats } from './types';
import GaniAssistant from './components/GaniAssistant';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import ArchitectMode from './components/ArchitectMode';
import MediaLab from './components/MediaLab';
import Roadmap from './components/Roadmap';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { startOnboardingTour } from './services/tourService';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [blueprints, setBlueprints] = useState<Blueprint[]>(BLUEPRINTS);
  const [deployedEcosystems, setDeployedEcosystems] = useState<DeployedEcosystem[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    hyphaBalance: 2500,
    usdBalance: 1500,
    totalYield: 0,
    activeNodes: 0,
    transactions: [],
    isWalletConnected: false,
    stakedAmount: 0,
    governancePower: 0
  });

  const handleConnectWallet = () => {
    if (userStats.isWalletConnected) return;
    
    // Simulate DID connection
    const fakeAddress = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
    setUserStats(prev => ({
      ...prev,
      isWalletConnected: true,
      walletAddress: fakeAddress,
      governancePower: 120
    }));
    
    setIsGaniOpen(true);
    // GANI will welcome the user in the assistant component based on state
  };
  const [isGaniOpen, setIsGaniOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deployingIds, setDeployingIds] = useState<string[]>([]);

  // Autonomous Income Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDeployedEcosystems(prev => prev.map(eco => {
        if (eco.status === 'Active' || eco.status === 'Sovereign') {
          const incomeGain = (eco.metrics.yieldRate / 100) * (Math.random() * 10);
          if (incomeGain > 0) {
            return {
              ...eco,
              metrics: {
                ...eco.metrics,
                autonomousIncome: eco.metrics.autonomousIncome + incomeGain
              }
            };
          }
        }
        return eco;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check for first visit and start tour
  useEffect(() => {
    const isComplete = localStorage.getItem('hypha_onboarding_complete');
    if (!isComplete) {
      const timer = setTimeout(() => {
        startOnboardingTour(navigate);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaimYield = (amount: number) => {
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance + amount,
      totalYield: prev.totalYield + amount,
      transactions: [
        { 
          id: `y-${Date.now()}`, 
          type: 'yield', 
          amount, 
          currency: 'HYPHA', 
          timestamp: new Date(), 
          description: 'Autonomous Yield Harvest' 
        },
        ...prev.transactions
      ]
    }));
  };

  const handlePurchase = (blueprint: Blueprint) => {
    const cost = blueprint.tier === 'Enterprise' ? 500 : blueprint.tier === 'Pro' ? 150 : 0;
    
    if (userStats.hyphaBalance < cost) {
      alert(`Insufficient HYPHA credits. Sync required. Need ${cost} but have ${userStats.hyphaBalance}. Gyss!`);
      return;
    }

    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance - cost,
      activeNodes: prev.activeNodes + 1,
      transactions: [
        { 
          id: `s-${Date.now()}`, 
          type: 'subscription', 
          amount: cost, 
          currency: 'HYPHA', 
          timestamp: new Date(), 
          description: `Subscription: ${blueprint.name}` 
        },
        ...prev.transactions
      ]
    }));

    handleDeploy(blueprint);
  };

  const handleStake = (amount: number) => {
    if (userStats.hyphaBalance < amount) return;
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance - amount,
      stakedAmount: prev.stakedAmount + amount,
      governancePower: prev.governancePower + (amount * 1.2),
      transactions: [
        { 
          id: `st-${Date.now()}`, 
          type: 'trade', 
          amount, 
          currency: 'HYPHA', 
          timestamp: new Date(), 
          description: 'HYPHA Staking' 
        },
        ...prev.transactions
      ]
    }));
  };

  const handleUnstake = (amount: number) => {
    if (userStats.stakedAmount < amount) return;
    setUserStats(prev => ({
      ...prev,
      hyphaBalance: prev.hyphaBalance + amount,
      stakedAmount: prev.stakedAmount - amount,
      governancePower: Math.max(0, prev.governancePower - (amount * 1.2)),
      transactions: [
        { 
          id: `ust-${Date.now()}`, 
          type: 'trade', 
          amount, 
          currency: 'HYPHA', 
          timestamp: new Date(), 
          description: 'HYPHA Unstaking' 
        },
        ...prev.transactions
      ]
    }));
  };

  const handleDeploy = (blueprint: Blueprint) => {
    setDeployingIds(prev => [...prev, blueprint.id]);

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
        `Establishing secure Mycelium Tunnel...`,
        `Activating Web4 Sovereign Protocol...`
      ],
      metrics: {
        computeUsage: '0ms',
        a2aActivity: '0',
        stateSize: '0KB',
        nodeHealth: 0,
        autonomousIncome: 0,
        yieldRate: blueprint.tier === 'Enterprise' ? 12.5 : blueprint.tier === 'Pro' ? 4.2 : 0.5,
        dwnSyncStatus: 0,
        verifiableCredentials: Math.floor(Math.random() * 5)
      },
      didHash: `did:hypha:0x${Math.random().toString(16).substring(2, 10)}`
    };
    
    setDeployedEcosystems(prev => [...prev, newEcosystem]);
    setIsGaniOpen(true);

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
      {/* Responsive Sidebar (Permanent on Desktop, Drawer on Mobile) */}
      <Sidebar 
        deployedCount={deployedEcosystems.length} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col h-screen relative">
        <Header 
          credits={userStats.hyphaBalance} 
          activePodsCount={deployedEcosystems.length} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isWalletConnected={userStats.isWalletConnected}
          walletAddress={userStats.walletAddress}
          onConnectWallet={handleConnectWallet}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pb-24 lg:pb-8">
          <Routes>
            <Route path="/" element={
              <Marketplace 
                blueprints={blueprints} 
                credits={userStats.hyphaBalance} 
                onDeploy={handlePurchase} 
                onUpdateBlueprint={handleUpdateBlueprint}
                deployingIds={deployingIds}
                deployedEcosystems={deployedEcosystems}
              />
            } />
            <Route path="/dashboard" element={
              <Dashboard 
                ecosystems={deployedEcosystems} 
                blueprints={blueprints} 
                userStats={userStats}
                onClaimYield={handleClaimYield}
                onStake={handleStake}
                onUnstake={handleUnstake}
              />
            } />
            <Route path="/architect" element={<ArchitectMode onSaveBlueprint={handleSaveBlueprint} />} />
            <Route path="/media-lab" element={<MediaLab />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
        
        {/* Mobile Navigation Bar */}
        <BottomNav activePodsCount={deployedEcosystems.length} />

        <GaniAssistant isOpen={isGaniOpen} setIsOpen={setIsGaniOpen} />
      </div>
    </div>
  );
};

export default App;
