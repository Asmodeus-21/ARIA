import React, { useState } from 'react';
import { X, Loader, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const LeadCaptureModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/ghl-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'Website Lead Capture Modal',
          tags: ['Website Lead', 'Popup'],
          pageUrl: window.location.href
        })
      });

      if (!res.ok) throw new Error('Failed');

      setStatus('success');
      setTimeout(onClose, 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[18000] flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Get Started with Aria</h2>
          <button className="p-2 rounded-full hover:bg-gray-200" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* SUCCESS */}
        {status === 'success' && (
          <div className="p-10 flex flex-col items-center text-center h-80 justify-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-semibold text-gray-900">Success!</h3>
            <p className="text-gray-600 mt-2">We'll reach out shortly.</p>
          </div>
        )}

        {/* FORM */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">First Name</label>
                <input
                  name="firstName"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Try again.</p>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? <Loader className="animate-spin" /> : 'Submit'}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to receive updates from Aria AI.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
