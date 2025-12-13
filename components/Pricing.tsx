import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { pricingPlans } from '../constants';

interface PricingProps {
  onGetStarted: () => void; // used for Enterprise / Contact Sales
}

// Calls your /api/create-checkout endpoint and opens Stripe Checkout
const startCheckout = async (planKey: string, planName: string) => {
  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey, planName }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to create checkout session.');
      console.error('Checkout error payload:', data);
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Something went wrong starting checkout.');
  }
};

const Pricing: React.FC<PricingProps> = ({ onGetStarted }) => {
  return (
    <section id="pricing" className="py-24 sm:py-32 relative scroll-mt-24 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight text-glow">
            Simple Pricing for <span className="gradient-text">Your Growth</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            Transparent plans. No hidden fees. Upgrade as you scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => {
            const key = plan.name.toLowerCase(); // "trial" | "starter" | "growth" | "enterprise"

            const handleClick = () => {
              if (plan.name === 'Enterprise') {
                // keep your existing flow (open lead form / contact sales)
                onGetStarted();
                return;
              }
              if (!['trial', 'starter', 'growth'].includes(key)) {
                alert('This plan is not configured yet.');
                return;
              }
              startCheckout(key, plan.name);
            };

            return (
              <div
                key={plan.name}
                className={`
                  group relative rounded-[2rem] p-8 flex flex-col transition-all duration-500 cursor-default
                  bg-white/60 backdrop-blur-md border border-white/80
                  hover:bg-white hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-blue-200 hover:z-20
                  ${plan.isFeatured ? 'shadow-xl ring-2 ring-blue-500/20 scale-[1.02] z-10' : 'shadow-sm'}
                `}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Sparkles size={12} fill="currentColor" /> Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={`text-xl font-bold transition-colors duration-300 ${
                      plan.isFeatured ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-snug min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight group-hover:scale-110 transition-transform duration-300 origin-left">
                      {plan.price}
                    </span>
                    {plan.price.startsWith('$') && (
                      <span className="text-sm font-medium text-gray-500 ml-1">/mo</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 transition-colors duration-300 ${
                          plan.isFeatured
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="ml-3 text-sm text-gray-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleClick}
                  className={`w-full py-4 text-base font-bold rounded-2xl transition-all duration-300 cursor-pointer border
                    ${
                      plan.isFeatured
                        ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg'
                    }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : `Get ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
