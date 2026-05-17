"use client";
import React, { useState } from 'react';
import { Mail, Phone, User, DollarSign, Send, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { getApiUrl } from "@/lib/api";

const NewsletterSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget_range: '500_1000'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getApiUrl(`/newsletter/`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.email?.[0] || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-20 bg-[#10B981] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-[1140px] mx-auto px-4 relative z-10">
          <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-[#10B981] w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">You're on the List, {formData.name}!</h2>
            <p className="text-gray-500 font-bold mb-10 max-w-lg mx-auto italic">
              "We've locked in your budget. The best hand-picked laptop deals are coming straight to your inbox."
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#10B981] opacity-[0.03] -skew-x-12 transform origin-top translate-x-1/4" />
      
      <div className="max-w-[1140px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 bg-[#10B981] bg-opacity-10 text-[#10B981] px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Join 50,000+ Smart Buyers</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Get Laptops at <span className="text-[#10B981] underline decoration-wavy underline-offset-8">Unbeatable Prices.</span>
            </h2>
            <p className="text-lg font-bold text-gray-500 leading-relaxed">
              Why browse for hours? Tell us your budget and we'll send the <span className="text-gray-900">#1 Top Rated</span> deals for your range directly to your phone.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mt-4">
               {[
                 { label: 'Real-time', icon: <Loader2 size={16} />, color: 'bg-orange-50 text-orange-600' },
                 { label: 'Email', icon: <Mail size={16} />, color: 'bg-green-50 text-green-600' },
                 { label: 'Verified', icon: <CheckCircle2 size={16} />, color: 'bg-blue-50 text-blue-600' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-3">
                    <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                       {item.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-900/5 border border-gray-100 relative group">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#10B981] transition-colors" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 focus-within:text-[#10B981]" size={20} />
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Laptop Budget</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</div>
                  <select 
                    value={formData.budget_range}
                    onChange={(e) => setFormData({...formData, budget_range: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#10B981] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none appearance-none transition-all"
                  >
                    <option value="under_50k">Under ₹50,000 (Budget)</option>
                    <option value="50k_100k">₹50,000 - ₹1,00,000 (Mid-Range)</option>
                    <option value="100k_150k">₹1,00,000 - ₹1,50,000 (Premium)</option>
                    <option value="over_150k">Above ₹1,50,000 (Enthusiast)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="mt-4 bg-gray-900 hover:bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                {loading ? 'Processing...' : 'Start Receiving Deals'}
              </button>
              
              {error && <p className="text-[10px] font-bold text-red-500 text-center">{error}</p>}

              <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest mt-2">
                🔒 We respect your privacy. No spam, just real deals.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
