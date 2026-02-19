
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
}

export interface DeployedEcosystem {
  id: string;
  blueprintId: string;
  name: string;
  status: 'Active' | 'Hibernating' | 'Syncing';
  deployedAt: string;
  logs: string[];
  metrics: {
    computeUsage: string;
    a2aActivity: string;
    stateSize: string;
    nodeHealth: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
