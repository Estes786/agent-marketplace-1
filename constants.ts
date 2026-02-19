
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
    ]
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
    ]
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
    ]
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
    ]
  }
];

export const PHILOSOPHY = {
  vision: "Optimization of Life through Integrated Intelligence",
  principles: ["Integritas", "Amanah", "Skalabilitas", "Service"],
  motto: "Akar Dalam, Cabang Tinggi",
  strategy: "The YKK Zipper (Hidden Champion)"
};
