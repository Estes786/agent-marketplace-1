
export enum AgentRole {
  ORCHESTRATOR = 'The Orchestrator',
  BARBER = 'The Barber',
  TEMAN = 'The Teman',
  KELUARGA = 'The Keluarga',
  CUSTOMER_SERVICE = 'The Customer Service',
  ANALYST = 'The Analyst',
  ARCHIVIST = 'The Archivist',
  GATEKEEPER = 'The Gatekeeper',
  INNOVATOR = 'The Innovator'
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CognitiveSpecs {
  reasoningDepth: number; // 0-100
  memoryPersistence: 'Volatile' | 'Linear' | 'Recursive';
  thinkingBudget: number; // tokens
  sovereigntyLevel: number; // 0-100
  economicAutonomy: boolean;
}

export interface Blueprint {
  id: string;
  name: string;
  industry: string;
  description: string;
  features?: string[];
  icon: string;
  roles: AgentRole[];
  price: string;
  tier: 'Free' | 'Pro' | 'Enterprise';
  infrastructure: 'Edge Worker' | 'Cloud Pod' | 'Hybrid Nexus';
  reviews: Review[];
  isFeatured?: boolean;
  deploymentCount: number;
  cognitiveSpecs?: CognitiveSpecs;
  didHash?: string;
}

export interface DeployedEcosystem {
  id: string;
  blueprintId: string;
  name: string;
  status: 'Active' | 'Hibernating' | 'Syncing' | 'Sovereign';
  deployedAt: string;
  logs: string[];
  metrics: {
    computeUsage: string;
    a2aActivity: string;
    stateSize: string;
    nodeHealth: number;
    autonomousIncome: number; // HYPHA earned
    yieldRate: number; // % per hour
    dwnSyncStatus: number; // 0-100%
    verifiableCredentials: number;
  };
  didHash?: string;
}

export interface Transaction {
  id: string;
  type: 'yield' | 'subscription' | 'trade' | 'reinvest';
  amount: number;
  currency: 'HYPHA' | 'USD';
  timestamp: Date;
  description: string;
}

export interface UserStats {
  hyphaBalance: number;
  usdBalance: number;
  totalYield: number;
  activeNodes: number;
  transactions: Transaction[];
  isWalletConnected: boolean;
  walletAddress?: string;
  stakedAmount: number;
  governancePower: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
