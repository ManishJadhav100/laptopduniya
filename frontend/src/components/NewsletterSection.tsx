"use client";
import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send, User } from "lucide-react";
import { getApiUrl } from "@/lib/api";

const NewsletterSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget_range: "under_50k",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(`/newsletter/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.email?.[0] || "Something went wrong. Please try again.",
        );
      }
    } catch (submitError: any) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-20 bg-[#10B981] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_55%)]" />
        <div className="site-shell relative z-10">
          <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-[#10B981] w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              You're on the List, {formData.name}!
            </h2>
            <p className="text-gray-500 font-bold mb-10 max-w-lg mx-auto italic">
              "We've locked in your budget. Fresh phone deals and standout price
              drops are heading to your inbox."
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#10B981] opacity-[0.03] -skew-x-12 transform origin-top translate-x-1/4" />

      <div className="site-shell relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-[#10B981] bg-opacity-10 text-[#10B981] px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Join Smart Mobile Buyers
              </span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Get Mobile Deals at{" "}
              <span className="text-[#10B981] underline decoration-wavy underline-offset-8">
                Sharper Prices.
              </span>
            </h2>
            <p className="text-lg font-bold text-gray-500 leading-relaxed">
              Tell us your budget and we'll send the strongest phone deals, price
              drops, and camera-value picks directly to your inbox.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-4">
              {[
                { label: "Tracked", icon: <Loader2 size={16} />, color: "bg-orange-50 text-orange-600" },
                { label: "Email", icon: <Mail size={16} />, color: "bg-green-50 text-green-600" },
                { label: "Verified", icon: <CheckCircle2 size={16} />, color: "bg-blue-50 text-blue-600" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-900/5 border border-gray-100 relative group">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Your Phone Budget
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(event) =>
                    setFormData({ ...formData, budget_range: event.target.value })
                  }
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 px-6 text-sm font-bold outline-none appearance-none transition-all"
                >
                  <option value="under_50k">Under Rs. 50,000 (Value / Midrange)</option>
                  <option value="50k_100k">Rs. 50,000 - 1,00,000 (Flagship Killers)</option>
                  <option value="100k_150k">Rs. 1,00,000 - 1,50,000 (Premium Flagships)</option>
                  <option value="over_150k">Above Rs. 1,50,000 (Ultra / Foldables)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-gray-900 hover:bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                {loading ? "Processing..." : "Start Receiving Deals"}
              </button>

              {error ? (
                <p className="text-[10px] font-bold text-red-500 text-center">{error}</p>
              ) : null}

              <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest mt-2">
                We respect your privacy. No spam, just useful phone deals.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
