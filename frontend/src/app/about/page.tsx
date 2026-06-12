import React from 'react';
import { Award, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#10B981] opacity-[0.02] -skew-x-12 transform origin-top translate-x-1/4" />
        <div className="site-shell relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#10B981] bg-opacity-10 text-[#10B981] px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Our Mission</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 leading-tight tracking-tight mb-8">
              Helping You Find the <span className="text-[#10B981]">Perfect Phone</span> Without the Stress.
            </h1>
            <p className="text-xl font-bold text-gray-500 leading-relaxed">
              At PhoneRadar, we believe that choosing a smartphone should not feel like guesswork. We combine technical expertise with real-world testing to bring you clear, confident buying decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="site-shell">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] mb-6 group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Data-Driven Reviews</h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                We do more than read spec sheets. We benchmark, test battery life, and analyze displays to give you the raw truth.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] mb-6 group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
                < Award size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Honest Expertise</h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                If a phone has weak battery life, camera issues, or poor value, we will tell you. Our loyalty is to our readers, not the manufacturers.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] mb-6 group-hover:bg-[#10B981] group-hover:text-white transition-all shadow-sm">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Community First</h3>
              <p className="text-gray-500 font-bold leading-relaxed">
                Everything we build—from our comparison tools to our guides—is designed to solve your specific problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 bg-gray-900 text-white rounded-t-[4rem]">
        <div className="site-shell">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4 uppercase italic">How We Review</h2>
            <div className="h-1.5 w-24 bg-[#10B981] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Manual Testing', desc: 'Hardware used in real workloads.' },
              { step: '02', title: 'Direct Compare', desc: 'Side-by-side spec validation.' },
              { step: '03', title: 'User Feedback', desc: 'Aggregating real owner data.' },
              { step: '04', title: 'Price Scan', desc: 'Daily scans of Amazon & Flipkart.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
                <span className="text-4xl font-black text-[#10B981] opacity-50 mb-6 block">{item.step}</span>
                <h4 className="text-xl font-black mb-3 italic tracking-tight uppercase">{item.title}</h4>
                <p className="text-gray-400 font-bold text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

