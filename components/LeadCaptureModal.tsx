
import React, { useState } from 'react';
import { X, Loader, CheckCircle } from 'lucide-react';

const LeadCaptureModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // INTEGATION NOTE:
    // To send this data to GoHighLevel, you have two secure options:
    // 1. Create a "Lead Form" webhook in Zapier/Make.com and paste the URL below.
    // 2. Create a backend API route (e.g. /api/ghl-contact) that calls the GHL API securely.
    // DO NOT put your GHL API Key directly here in the frontend code.
    
    const WEBHOOK_URL = 'https://your-webhook-url-here.com/submit'; // Replace this!

    try {
      // Simulating a network request for the UI demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Uncomment this when you have your backend/webhook ready:
      /*
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            source: 'Aria Landing Page',
            tags: ['New Lead', 'Aria Web']
        }),
      });
      */

      setStatus('success');
      setTimeout(onClose, 2500); 
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-fade-in-up">
        <header className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Get Started with Aria</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500 cursor-pointer">
            <X size={20} />
          </button>
        </header>
        
        {status === 'success' ? (
             <div className="p-10 flex flex-col items-center justify-center text-center h-80">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                <p className="text-gray-600 mt-2">We've received your details and will be in touch shortly.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" name="firstName" id="firstName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" name="lastName" id="lastName" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" onChange={handleChange} />
                </div>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" id="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" id="phone" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" onChange={handleChange} />
            </div>
            
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
                >
                    {status === 'loading' ? <Loader className="animate-spin" /> : 'Request Access'}
                </button>
            </div>
            
            {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
            
            <p className="text-xs text-gray-400 text-center mt-4">
                By clicking Request Access, you agree to receive updates from Aria AI.
            </p>
            </form>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
