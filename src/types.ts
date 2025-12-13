
import { ReactElement } from 'react';

export interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isFeatured: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface BrainFeature {
  id: string;
  icon: ReactElement;
  title: string;
  problem: string;
  solution: string;
  exampleTitle: string;
  example: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'cyan' | 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'sky' | 'lime' | 'fuchsia';
}
