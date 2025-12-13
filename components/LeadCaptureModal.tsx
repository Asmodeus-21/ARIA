import React, { useState } from "react";
import { X, Loader, CheckCircle } from "lucide-react";

interface Props {
  onClose: () => void;
}

const LeadCaptureModal: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/ghl-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "Website Lead Capture Modal",
          tags: ["Website Lead", "Popup"],
          pageUrl: window.location.href
        })
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Lead submit failed:", error);
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[18000] flex items-center justify-center p-4 pointer-events-auto overflow-y-auto">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
      >

        {/* HEADER */}
        <header className="p-5 border-b bg-gray-50 flex justify-between items-center">
          <h2 id="lead-modal-title" className="text-xl font-bold text-gray-900">Get Started with Aria</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer touch-manipulation"
          >
            <X size={20} />
          </button>
        </header>

        {/* SUCCESS STATE */}
        {status === "success" ? (
          <div className="p-10 flex flex-col h-80 items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-semibold text-gray-900">Success!</h3>
            <p className="text-gray-600 mt-2">We’ll reach out shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  First Name
                </label>
                <input
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 mb-1 block">
                  Last Name
                </label>
                <input
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-1 block">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center">
                Something went wrong. Try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
            >
              {status === "loading" ? (
                <Loader className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>

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
