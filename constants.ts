
import { Blueprint, AgentRole } from './types';

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'real-estate-legacy',
    name: 'Real Estate Legacy Pod',
    industry: 'Property',
    description: 'Autonomous management of property listings, client inquiries, and legal document verification via Mycelium Layer. Now features fully automated lead qualification and initial client contact protocols.',
    features: [
      'Integrated Lead Qualification & Contact Automation',
      'Automated Lead Qualification Engine',
      'Initial Client Contact Orchestrator',
      'Mycelium Document Verification',
      'RLS-Protected Property Vault'
    ],
    icon: '🏠',
    roles: [AgentRole.ORCHESTRATOR, AgentRole.ANALYST, AgentRole.CUSTOMER_SERVICE, AgentRole.GATEKEEPER],
    price: '$0/mo',
    tier: 'Free',
    infrastructure: 'Edge Worker',
    isFeatured: true,
    deploymentCount: 1242,
    reviews: [
      { id: 'r1', userName: 'DevAgent_01', rating: 5, comment: 'Flawless orchestration of RLS policies.', date: '2025-05-20' },
      { id: 'r2', userName: 'PropManager', rating: 4, comment: 'Great automation, would love more custom role hooks.', date: '2025-05-18' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 65,
      memoryPersistence: 'Linear',
      thinkingBudget: 8192,
      sovereigntyLevel: 45,
      economicAutonomy: false
    }
  },
  {
    id: 'barber-dynasty',
    name: 'Barber Dynasty Engine',
    industry: 'Personal Services',
    description: 'Expert hair styling advice, automated booking orchestration, and inventory management using the YKK Zipper strategy.',
    features: [
      'StyleGen Visual Consultant',
      'A2A Appointment Zipper',
      'Inventory Level Prediction',
      'Customer Loyalty Mycelium'
    ],
    icon: '✂️',
    roles: [AgentRole.BARBER, AgentRole.CUSTOMER_SERVICE, AgentRole.INNOVATOR, AgentRole.ARCHIVIST],
    price: '$0/mo',
    tier: 'Free',
    infrastructure: 'Edge Worker',
    deploymentCount: 843,
    reviews: [
      { id: 'r3', userName: 'StyleGenie', rating: 5, comment: 'The YKK Zipper strategy really works invisibly.', date: '2025-05-21' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 55,
      memoryPersistence: 'Volatile',
      thinkingBudget: 4096,
      sovereigntyLevel: 30,
      economicAutonomy: false
    }
  },
  {
    id: 'family-nexus',
    name: 'The Big Family Legacy',
    industry: 'Lifestyle',
    description: 'Private coordination for family events, reminders, and warm conversational support with isolated memory roots.',
    features: [
      'Isolated Memory Roots',
      'Sentimental Archivist Node',
      'Event Conflict Resolver',
      'Secure Family Tunnel'
    ],
    icon: '👨‍👩‍👧‍👦',
    roles: [AgentRole.KELUARGA, AgentRole.TEMAN, AgentRole.ARCHIVIST, AgentRole.ORCHESTRATOR],
    price: '$19/mo',
    tier: 'Pro',
    infrastructure: 'Cloud Pod',
    deploymentCount: 312,
    reviews: [
      { id: 'r4', userName: 'FamilyFirst', rating: 5, comment: 'GANI handles reminders like a human sibling.', date: '2025-05-15' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 75,
      memoryPersistence: 'Recursive',
      thinkingBudget: 12288,
      sovereigntyLevel: 60,
      economicAutonomy: false
    }
  },
  {
    id: 'media-empire',
    name: 'Media Empire Nexus',
    industry: 'Content Creation',
    description: 'AI-driven content scheduling, trend analysis, and engagement automation across IG/TG/Threads.',
    features: [
      'Multi-Channel Engagement Hub',
      'Trend Grounding Engine',
      'Automated Asset Synthesizer',
      'Performance Analytics Roots'
    ],
    icon: '📸',
    roles: [AgentRole.INNOVATOR, AgentRole.ANALYST, AgentRole.ORCHESTRATOR, AgentRole.ARCHIVIST],
    price: '$49/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    isFeatured: true,
    deploymentCount: 156,
    reviews: [
      { id: 'r5', userName: 'CreatorFlow', rating: 3, comment: 'A bit pricey but the trend analysis is top notch.', date: '2025-05-22' }
    ],
    cognitiveSpecs: {
      reasoningDepth: 85,
      memoryPersistence: 'Recursive',
      thinkingBudget: 24576,
      sovereigntyLevel: 80,
      economicAutonomy: true
    }
  },
  {
    id: 'supply-chain-sovereign',
    name: 'Autonomous Supply Chain Sovereign',
    industry: 'Logistics & Trade',
    description: 'A high-level sovereign entity that manages global supply chains, performs autonomous spot-market trading for freight, and self-optimizes inventory levels across distributed nodes. Operates with full economic autonomy.',
    features: [
      'Autonomous Freight Spot-Trading',
      'Recursive Inventory Optimization',
      'DID-Verified Carrier Onboarding',
      'Quantum-Secured Trade Ledger',
      'Zero-Knowledge Compliance Audits'
    ],
    icon: '🚢',
    roles: [AgentRole.ORCHESTRATOR, AgentRole.ANALYST, AgentRole.GATEKEEPER, AgentRole.INNOVATOR],
    price: '$499/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    isFeatured: true,
    deploymentCount: 42,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 95,
      memoryPersistence: 'Recursive',
      thinkingBudget: 32768,
      sovereigntyLevel: 98,
      economicAutonomy: true
    }
  },
  {
    id: 'fintech-yield-master',
    name: 'Sovereign Yield Orchestrator',
    industry: 'Fintech',
    description: 'Enterprise-grade financial agent designed for autonomous yield farming, risk-adjusted asset allocation, and real-time liquidity management across multiple Web4 protocols.',
    features: [
      'Multi-Protocol Yield Harvesting',
      'Real-time Risk-Adjusted Rebalancing',
      'Autonomous Liquidity Provisioning',
      'Sovereign Wealth Management Core',
      'AI-Driven Arbitrage Execution'
    ],
    icon: '📈',
    roles: [AgentRole.ANALYST, AgentRole.ORCHESTRATOR, AgentRole.ARCHIVIST, AgentRole.INNOVATOR],
    price: '$199/mo',
    tier: 'Pro',
    infrastructure: 'Cloud Pod',
    isFeatured: true,
    deploymentCount: 128,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 88,
      memoryPersistence: 'Linear',
      thinkingBudget: 16384,
      sovereigntyLevel: 92,
      economicAutonomy: true
    }
  },
  {
    id: 'legal-compliance-vault',
    name: 'Sovereign Legal Compliance Pod',
    industry: 'Legal & Governance',
    description: 'Autonomous legal entity that monitors global regulatory changes, performs self-audits on corporate structures, and manages DID-linked contract execution with absolute integrity.',
    features: [
      'Real-time Regulatory Grounding',
      'Autonomous Contract Synthesis',
      'DID-Linked Governance Framework',
      'Immutable Compliance Archiving',
      'Self-Directed Legal Risk Analysis'
    ],
    icon: '⚖️',
    roles: [AgentRole.GATEKEEPER, AgentRole.ARCHIVIST, AgentRole.ORCHESTRATOR, AgentRole.ANALYST],
    price: '$299/mo',
    tier: 'Enterprise',
    infrastructure: 'Hybrid Nexus',
    deploymentCount: 85,
    reviews: [],
    cognitiveSpecs: {
      reasoningDepth: 92,
      memoryPersistence: 'Recursive',
      thinkingBudget: 24576,
      sovereigntyLevel: 95,
      economicAutonomy: false
    }
  }
];

export const PHILOSOPHY = {
  vision: "Optimization of Life through Integrated Intelligence",
  principles: ["Integritas", "Amanah", "Skalabilitas", "Service"],
  motto: "Akar Dalam, Cabang Tinggi",
  strategy: "The YKK Zipper (Hidden Champion)"
};
