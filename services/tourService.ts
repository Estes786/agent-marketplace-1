
import Shepherd from 'shepherd.js';

export const startOnboardingTour = (navigate: (path: string) => void) => {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: { behavior: 'smooth', block: 'center' }
    }
  });

  tour.addStep({
    id: 'welcome',
    title: 'Welcome to GANI HYPHA 🌀',
    text: 'Selamat datang, Gyss! I am GANI, and this is your command center for the agentic empire. Let me show you around the Hypha Engine.',
    buttons: [
      {
        text: 'Skip Tour',
        action: tour.complete,
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: tour.next
      }
    ]
  });

  tour.addStep({
    id: 'marketplace',
    attachTo: {
      element: '[data-tour="marketplace-list"]',
      on: 'bottom'
    },
    title: 'The Blueprint Vault',
    text: 'Browse and deploy industry-grade Legacy Pods. These are autonomous micro-economies ready to be instantiated in your node.',
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: tour.next
      }
    ]
  });

  tour.addStep({
    id: 'grounding',
    attachTo: {
      element: '[data-tour="grounding-engine"]',
      on: 'bottom'
    },
    title: 'Grounding Engine v2.1',
    text: 'Stay ahead of the curve! We sync real-time market trends and provide "Quick Deploy" blueprints to capture immediate growth opportunities.',
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: tour.next
      }
    ]
  });

  tour.addStep({
    id: 'sidebar-nav',
    attachTo: {
      element: '[data-tour="sidebar-nav"]',
      on: 'right'
    },
    title: 'Navigation Nodes',
    text: 'Seamlessly switch between the Marketplace, your Command Center dashboard, and the Architect engine.',
    buttons: [
      {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: () => {
          navigate('/architect');
          setTimeout(() => tour.next(), 300); // Wait for navigation
        }
      }
    ]
  });

  tour.addStep({
    id: 'architect-mode',
    attachTo: {
      element: '[data-tour="architect-input"]',
      on: 'bottom'
    },
    title: 'Architect Mode',
    text: 'Design custom lifeforms from scratch. Define your requirements and watch the Mycelium Engine synthesize a perfect infrastructure spec.',
    buttons: [
      {
        text: 'Back',
        action: () => {
          navigate('/');
          setTimeout(() => tour.back(), 300);
        },
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: tour.next
      }
    ]
  });

  tour.addStep({
    id: 'roadmap',
    attachTo: {
      element: '[data-tour="sidebar-nav"]',
      on: 'right'
    },
    title: 'Wealth Journey 🚀',
    text: 'Follow the roadmap to sovereign wealth. Learn how to scale your digital empire and harvest autonomous yield.',
    buttons: [
      {
        text: 'Back',
        action: () => {
          navigate('/architect');
          setTimeout(() => tour.back(), 300);
        },
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Next',
        action: () => {
          navigate('/roadmap');
          setTimeout(() => tour.next(), 300);
        }
      }
    ]
  });

  tour.addStep({
    id: 'gani-assistant',
    attachTo: {
      element: '[data-tour="gani-trigger"]',
      on: 'top'
    },
    title: 'GANI AI Concierge',
    text: 'Always here to help, Gyss! Click here anytime to ask about orchestration, deployment, or visual asset synthesis.',
    buttons: [
      {
        text: 'Back',
        action: () => {
          navigate('/roadmap');
          setTimeout(() => tour.back(), 300);
        },
        classes: 'shepherd-button-secondary'
      },
      {
        text: 'Finish',
        action: () => {
          tour.complete();
          localStorage.setItem('hypha_onboarding_complete', 'true');
        }
      }
    ]
  });

  tour.start();
};
