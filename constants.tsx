
import React from 'react';
import { Phone, Calendar, Mail, MessageSquare, Database, DollarSign, UserCheck, Repeat, Languages, Clock, BarChart, FileText, Globe, CreditCard, Magnet, PhoneForwarded, LifeBuoy, Zap } from 'lucide-react';
import type { Feature, Testimonial, PricingPlan, BrainFeature } from './types';

export const features: Feature[] = [
  { icon: <Phone size={24} className="text-blue-500" />, title: 'AI Phone Calls', description: 'Handles your calls so you never miss a lead.' },
  { icon: <Calendar size={24} className="text-green-500" />, title: 'Appointment Scheduling', description: 'Books and confirms your appointments instantly without you lifting a finger.' },
  { icon: <Calendar size={24} className="text-purple-500" />, title: 'Calendar Management', description: 'Syncs with your calendar in real-time to keep your schedule organized.' },
  { icon: <Mail size={24} className="text-red-500" />, title: 'Email Handling', description: 'Responds to your emails and keeps your inbox perfectly sorted.' },
  { icon: <MessageSquare size={24} className="text-yellow-500" />, title: 'SMS Replies & Reminders', description: 'Sends texts and reminders to your clients so you don’t have to.' },
  { icon: <Database size={24} className="text-indigo-500" />, title: 'CRM Integration', description: 'Updates your CRM automatically, ensuring your data is always accurate.' },
  { icon: <DollarSign size={24} className="text-pink-500" />, title: 'Payment Collection', description: 'Securely collects payments for you over the phone, improving your cash flow.' },
  { icon: <UserCheck size={24} className="text-teal-500" />, title: 'Customer Follow-ups', description: 'Follows up with your customers automatically to keep them engaged.' },
  { icon: <UserCheck size={24} className="text-cyan-500" />, title: 'Lead Qualification', description: 'Qualifies your leads based on your specific criteria before they reach you.' },
  { icon: <Clock size={24} className="text-orange-500" />, title: '24/7 Availability', description: 'Works for you around the clock, ensuring you are always in the loop.' },
  { icon: <Languages size={24} className="text-lime-500" />, title: 'Multi-Language Support', description: 'Serves your diverse customer base fluently in multiple languages.' },
  { icon: <BarChart size={24} className="text-fuchsia-500" />, title: 'Real-time Updates', description: 'Gives you instant summaries and updates so you are always in the loop.' },
];

export const brainFeatures: BrainFeature[] = [
    {
        id: 'calls',
        icon: <Magnet size={24} />,
        title: 'Instant Lead Capture',
        problem: 'You miss 60% of calls because you are busy, asleep, or on another line.',
        solution: 'Aria answers instantly, 24/7, with human-level empathy and intelligence.',
        exampleTitle: 'The 2 AM Lead',
        example: 'A high-value prospect calls at 2 AM. Aria answers, answers their questions, and books a demo for Tuesday morning.',
        color: 'orange'
    },
    {
        id: 'schedule',
        icon: <Calendar size={24} />,
        title: 'Smart Scheduling',
        problem: 'You waste hours in "email ping-pong" trying to find a meeting time.',
        solution: 'Aria accesses your calendar in real-time and negotiates slots directly.',
        exampleTitle: 'The Double Booking Fix',
        example: 'Client asks for "next Tuesday". Aria checks your real availability, offers 2 PM, and sends the invite instantly.',
        color: 'green'
    },
    {
        id: 'crm',
        icon: <Database size={24} />,
        title: 'Zero-Entry CRM',
        problem: 'Your CRM is outdated because manual data entry is boring and error-prone.',
        solution: 'Aria updates contact details, notes, and deal stages immediately after every interaction.',
        exampleTitle: 'Auto-Logging',
        example: 'After a call, Aria creates a HubSpot contact, logs the recording, and tags the lead as "Interested".',
        color: 'blue'
    },
    {
        id: 'outbound',
        icon: <PhoneForwarded size={24} />,
        title: 'Outbound Reactivation',
        problem: 'You have a list of 500 old leads but no time to call them.',
        solution: 'Aria can dial thousands of leads simultaneously to reignite interest.',
        exampleTitle: 'Dead Lead Revival',
        example: 'Aria calls your 6-month-old leads. "Hi John, saw you were interested last year, we have a new offer..."',
        color: 'purple'
    },
    {
        id: 'sms',
        icon: <MessageSquare size={24} />,
        title: 'Omnichannel Sync',
        problem: 'Leads text you, but you miss it because you are on a call.',
        solution: 'Aria replies to SMS and WhatsApp instantly, answering questions and booking times.',
        exampleTitle: 'The Text Inquiry',
        example: 'Lead texts: "How much is it?" Aria replies: "Our plans start at $99. Want to book a quick call to discuss?"',
        color: 'amber'
    },
    {
        id: 'payments',
        icon: <CreditCard size={24} />,
        title: 'Payment Collection',
        problem: 'Chasing clients for deposits or late payments is awkward and time-consuming.',
        solution: 'Aria securely collects credit card details over the phone or sends payment links.',
        exampleTitle: 'The Deposit',
        example: 'Client says "Let\'s do it." Aria says "Great, I can take that $500 deposit securely right now." and processes it.',
        color: 'emerald'
    },
    {
        id: 'support',
        icon: <LifeBuoy size={24} />,
        title: 'L1 Support',
        problem: 'Your team answers the same 5 basic questions all day long.',
        solution: 'Aria handles FAQs, basic troubleshooting, and routing, freeing your humans for complex issues.',
        exampleTitle: 'The FAQ Shield',
        example: 'Caller: "Where do I park?" Aria: "We have a free garage on 5th street. Anything else?"',
        color: 'rose'
    },
    {
        id: 'lang',
        icon: <Globe size={24} />,
        title: 'Global Fluency',
        problem: 'You are losing customers who don\'t speak your native language.',
        solution: 'Aria speaks 30+ languages fluently, detecting and switching automatically.',
        exampleTitle: 'The International Client',
        example: 'Caller speaks Spanish. Aria instantly switches to Spanish to close the deal without skipping a beat.',
        color: 'cyan'
    }
];

export const testimonials: Testimonial[] = [
  { quote: 'Aria hasn\'t just replaced our reception; it improved it. We capture every lead, 24/7, and our closing rate has increased by 35% since implementation.', author: 'Sarah Jenkins', company: 'Elite Realty Group' },
  { quote: 'The multilingual capabilities are flawless. Aria speaks to our Japanese clients with the same fluency and professionalism as our US partners.', author: 'Kenji Tanaka', company: 'Pacific Trade Corp' },
  { quote: 'Our front desk was overwhelmed. Aria stepped in and now handles 400+ calls a week. It books appointments directly while my staff focus on patient care.', author: 'Dr. Elena Rodriguez', company: 'Vitality Health Clinic' },
  { quote: 'In law, every call matters. Aria qualifies our leads intelligently, ensuring I only spend time on viable cases. It’s the smartest hiring decision I’ve made.', author: 'Marcus Thorne', company: 'Thorne Legal Partners' },
  { quote: 'I was skeptical that an AI could sound natural. Aria proved me wrong. Clients have no idea they aren\'t speaking to a human. The CRM sync is perfect.', author: 'Priya Patel', company: 'Nexus Tech Solutions' },
  { quote: 'We used to miss calls when under a car. Now, Aria takes bookings and sends SMS reminders. Our schedule is full, and our phone anxiety is gone.', author: 'David O\'Connell', company: 'O\'Connell Automotive' },
  { quote: 'Managing event RSVPs was a nightmare. Aria automated the entire follow-up process. It’s like having a super-efficient assistant who never sleeps.', author: 'Sophie Dubois', company: 'Lumière Events' },
  { quote: 'The ROI is undeniable. Within two months, Aria saved us thousands in operational costs while improving our customer response time to zero seconds.', author: 'Lars Jensen', company: 'Nordic Architecture' },
  { quote: 'It handles complex scheduling conflicts better than any human receptionist I\'ve worked with. The calendar management feature is worth every penny.', author: 'Amara Okafor', company: 'Zenith Financial' },
  { quote: 'Aria gave us our weekends back. It handles weekend inquiries and populates our Monday schedule perfectly. Essential for work-life balance.', author: 'Felipe Costa', company: 'Rio Design Studio' },
];

export const pricingPlans: PricingPlan[] = [
    {
        name: 'Trial',
        price: '$99',
        description: 'Perfect for you to test the waters.',
        features: [
            'Your AI inbound call bot',
            'Automated counter booking',
            'Missed call text back for you',
            '100 interactions for your leads',
            '7-day full access',
            'No workflows/outbound'
        ],
        isFeatured: false,
    },
    {
        name: 'Starter',
        price: '$497',
        description: 'Your essential automation suite.',
        features: [
            'All Trial features included',
            '1,000 AI interactions/mo for you',
            '1 AI phone number',
            'Basic integration for your CRM',
            'Automated Email Handling',
            'Standard Support for your team'
        ],
        isFeatured: false,
    },
    {
        name: 'Growth',
        price: '$997',
        description: 'Your complete automated sales machine.',
        features: [
            'All Starter features included',
            '4,000 - 6,000 interactions for you',
            '2-3 AI phone numbers',
            'Your AI Inbound & Outbound',
            'Smart lead qualification',
            'Pipeline automation for your deals',
            'Monthly optimization calls'
        ],
        isFeatured: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Tailored for your large-scale operations.',
        features: [
            'Unlimited Interactions for you',
            'Dedicated Lines for your brand',
            'Custom CRM Integrations',
            'Multi-department routing',
            'White-label options for you',
            'API Access for your devs'
        ],
        isFeatured: false,
    },
];

export const brandLogos = [
    { name: 'Apple', src: 'https://cdn.simpleicons.org/apple' },
    { name: 'Google', src: 'https://cdn.simpleicons.org/google' },
    { name: 'Microsoft', src: 'https://cdn.simpleicons.org/microsoft' },
    { name: 'Amazon', src: 'https://cdn.simpleicons.org/amazon' },
    { name: 'Tesla', src: 'https://cdn.simpleicons.org/tesla' },
    { name: 'Meta', src: 'https://cdn.simpleicons.org/meta' },
    { name: 'Netflix', src: 'https://cdn.simpleicons.org/netflix' },
    { name: 'Spotify', src: 'https://cdn.simpleicons.org/spotify' },
    { name: 'Nike', src: 'https://cdn.simpleicons.org/nike' },
    { name: 'Airbnb', src: 'https://cdn.simpleicons.org/airbnb' },
    { name: 'Uber', src: 'https://cdn.simpleicons.org/uber' },
    { name: 'Samsung', src: 'https://cdn.simpleicons.org/samsung' },
    { name: 'IBM', src: 'https://cdn.simpleicons.org/ibm' },
    { name: 'Oracle', src: 'https://cdn.simpleicons.org/oracle' },
];

/**
 * Z-Index System for consistent layering across desktop and mobile
 * This ensures proper stacking order and prevents mobile button interaction issues
 */
export const zIndex = {
  // Background layers (behind content)
  background: -1,
  backgroundBlobs: 0,
  
  // Content layers
  content: 10,
  contentRaised: 20,
  
  // Navigation and interactive elements
  header: 100,
  dropdown: 110,
  
  // Modals and overlays
  modalBackdrop: 1000,
  modal: 1010,
  
  // Floating elements (highest priority)
  floatingChat: 9000,
  toast: 9100,
} as const;
