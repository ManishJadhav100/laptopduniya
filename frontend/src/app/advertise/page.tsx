import React from 'react';
import { TrendingUp, Users, Target, Zap, Mail } from 'lucide-react';

export default function AdvertisePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="site-shell relative z-10 text-center">
          <h1 className="text-6xl font-black mb-6 tracking-tight uppercase italic decoration-[#10B981] underline underline-offset-[12px] decoration-8">Advertise with Us</h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Reach a targeted audience of high-intent smartphone buyers, deal hunters, and mobile tech enthusiasts.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 site-shell">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="text-5xl font-black text-[#10B981] mb-2 tracking-tighter shrink-0">50K+</div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Monthly Visitors</p>
           </div>
           <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="text-5xl font-black text-[#10B981] mb-2 tracking-tighter shrink-0">12K+</div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Email/Push Subs</p>
           </div>
           <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="text-5xl font-black text-[#10B981] mb-2 tracking-tighter shrink-0">4.8m</div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Annual Deal Scans</p>
           </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-gray-50 rounded-[4rem]">
        <div className="site-shell">
          <h2 className="text-4xl font-black text-gray-900 mb-16 text-center italic uppercase tracking-tight">Why Partner with PhoneRadar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { icon: <TrendingUp />, title: 'High Intent Traffic', desc: 'Our users are at the final stage of the buying funnel—researching specific models and comparing prices.' },
              { icon: <Target />, title: 'Niche Focus', desc: '100% of our content is dedicated to smartphones, accessories, deals, and mobile buying advice. Zero wasted impressions.' },
              { icon: <Users />, title: 'Established Trust', desc: 'Our expert ratings, comparison tools, and deal coverage have built a loyal, returning audience.' },
              { icon: <Zap />, title: 'Native Integration', desc: 'We offer sponsored reviews, deal highlighting, and direct placement in our "Buying Guides".' },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-2 italic tracking-tight uppercase">{item.title}</h4>
                  <p className="text-gray-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Advertising */}
      <section className="py-24 site-shell text-center">
         <div className="bg-gray-900 p-16 rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#10B981] opacity-10 blur-[100px]" />
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight italic">Ready to grow?</h2>
            <p className="text-gray-400 font-bold mb-10 max-w-xl mx-auto">Contact our partnership team for our full media kit and pricing options.</p>
            <div className="flex items-center justify-center gap-4 bg-white/10 w-fit mx-auto px-10 py-5 rounded-2xl border border-white/10 hover:border-[#10B981] transition-all group">
               <Mail className="text-[#10B981]" />
               <span className="text-xl font-black text-white group-hover:text-[#10B981] transition-colors tracking-tight">hello@phoneradar.in</span>
            </div>
         </div>
      </section>
    </div>
  );
}

