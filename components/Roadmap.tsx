
import React from 'react';
import { motion } from 'motion/react';

const Roadmap: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'Initialize Sovereign DID',
      desc: 'Establish your unique decentralized identity on the Hypha Mesh. This is your passport to the Web4 digital economy.',
      icon: '🆔',
      status: 'Ready'
    },
    {
      id: '02',
      title: 'Deploy Legacy Pods',
      desc: 'Select industry-grade blueprints from the Marketplace. Each pod is a self-contained micro-economy with autonomous logic.',
      icon: '📦',
      status: 'Ready'
    },
    {
      id: '03',
      title: 'Activate Economic Autonomy',
      desc: 'Enable the Sovereign Protocol. Your agents begin autonomous spot-trading, yield harvesting, and service provisioning.',
      icon: '⚡',
      status: 'Ready'
    },
    {
      id: '04',
      title: 'Harvest Autonomous Yield',
      desc: 'Monitor the Quantum Ledger as your agents generate HYPHA credits through real-world industrial optimization.',
      icon: '💰',
      status: 'Active'
    },
    {
      id: '05',
      title: 'Scale to Global Mesh',
      desc: 'Interconnect multiple pods into a recursive mycelium network. Your digital empire scales horizontally across the Web4 infrastructure.',
      icon: '🌍',
      status: 'Scaling'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 mb-2">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          The Path to Sovereign Wealth
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Web4 Wealth Journey</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed">
          Gyss! Follow the Hypha Roadmap to transform from a node operator into a Sovereign Digital Emperor. 
          The Mycelium Engine is ready to generate autonomous income for you.
        </p>
      </div>

      <div className="relative space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-slate-800 to-transparent hidden md:block"></div>

        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row gap-8 group"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl z-10 shadow-2xl group-hover:border-indigo-500/50 transition-all group-hover:scale-110">
              {step.icon}
            </div>
            
            <div className="flex-1 glass p-8 rounded-[2.5rem] border border-slate-800/60 group-hover:border-indigo-500/30 transition-all shadow-xl bg-slate-950/20">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-indigo-500 font-black tracking-widest uppercase">Phase {step.id}</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{step.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  step.status === 'Active' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : step.status === 'Scaling'
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 animate-pulse'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-500'
                }`}>
                  {step.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{step.desc}</p>
              
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${step.status === 'Ready' || step.status === 'Active' || step.status === 'Scaling' ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    style={{ width: step.status === 'Ready' ? '100%' : step.status === 'Active' ? '75%' : step.status === 'Scaling' ? '40%' : '0%' }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-600">
                  {step.status === 'Ready' ? '100%' : step.status === 'Active' ? '75%' : step.status === 'Scaling' ? '40%' : '0%'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-12">
        <div className="text-center">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">The Web Evolution</h3>
          <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-widest">From Static Data to Sovereign Wealth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { v: '1.0', label: 'Read', desc: 'Static Blueprints', color: 'slate' },
            { v: '2.0', label: 'Write', desc: 'Marketplace UI', color: 'blue' },
            { v: '3.0', label: 'Own', desc: 'DID & Tokens', color: 'emerald' },
            { v: '4.0', label: 'Execute', desc: 'Autonomous Wealth', color: 'indigo' }
          ].map((web) => (
            <div key={web.v} className="glass p-6 rounded-3xl border border-slate-800/60 text-center space-y-3 group hover:border-indigo-500/40 transition-all">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Web {web.v}</span>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{web.label}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{web.desc}</p>
              <div className={`w-full h-1 rounded-full bg-${web.color}-500/20 overflow-hidden`}>
                <div className={`h-full bg-${web.color}-500`} style={{ width: '100%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-12 rounded-[3.5rem] border border-emerald-500/20 bg-emerald-950/20 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">💎</div>
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
            High-Fidelity Economic Truth
          </div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">The Holy Clarity: Profit Protocol</h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium">
            Gyss! Here is the absolute truth on how the Hypha Engine converts autonomous intelligence into real-world value. 
            No simulations, just pure Web4 economic execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Infrastructure Provisioning',
              desc: 'You deploy "Legacy Pods" (Agentic Microservices). These are digital assets that perform real work (Logistics, Content, Finance).',
              money: 'Subscription Revenue',
              icon: '🏗️'
            },
            {
              step: '02',
              title: 'Autonomous Execution',
              desc: 'Your agents operate 24/7 on the Global Mesh. They execute arbitrage, optimize supply chains, and sell data to other agents.',
              money: 'Direct Yield (HYPHA)',
              icon: '⚡'
            },
            {
              step: '03',
              title: 'Liquidity Conversion',
              desc: 'Earned HYPHA credits are converted into USD or re-invested to scale your node reputation and infrastructure capacity.',
              money: 'Real-World Liquidity',
              icon: '🏦'
            }
          ].map((item) => (
            <div key={item.step} className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/60 space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-emerald-500 font-black uppercase tracking-widest">Step {item.step}</span>
                <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              <div className="pt-4 border-t border-slate-800/60">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Monetization Path</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">{item.money}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-12 rounded-[3.5rem] border border-slate-800/60 bg-slate-950/40 space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Monetization Engine</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-medium">
            How GANI HYPHA generates real value for you, Gyss! 😌
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl shrink-0">💳</div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">Leasing & Subscriptions</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Users pay HYPHA or USD to lease high-fidelity Legacy Pods. This creates immediate cash flow for the infrastructure providers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl shrink-0">📈</div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">Autonomous Yield</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Your agents perform autonomous spot-trading, yield farming, and industrial optimization, generating 24/7 passive income.</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">🤝</div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">A2A Service Economy</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">Agents sell specialized services (data analysis, content synth) to other agents. You take a commission on every autonomous transaction.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl shrink-0">💎</div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">Token Appreciation</h4>
                <p className="text-slate-500 text-xs leading-relaxed mt-1">As the Hypha Mesh grows, the utility and scarcity of the HYPHA token increase, driving long-term value for early node operators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-12 rounded-[3rem] border border-indigo-500/20 bg-indigo-500/5 text-center space-y-8">
        <div className="text-5xl">🚀</div>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Ready to Begin Your Empire?</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-sm font-medium">
          The Web4 economy waits for no one. Deploy your first Sovereign Pod today and start generating autonomous wealth. 
          Your node reputation is currently <span className="text-emerald-400 font-bold">98.4%</span>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            Go to Marketplace
          </button>
          <button 
            className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl font-black uppercase tracking-widest transition-all border border-slate-800 active:scale-95"
          >
            Sync Node DID
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
