import React from 'react';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="py-24 site-shell">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase italic">Get in Touch</h1>
          <p className="text-gray-500 font-bold max-w-xl mx-auto leading-relaxed">
            Have a question about a laptop or a deal? We're here to help. Reach out to the Laptop Duniya team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 group hover:border-[#10B981] transition-all">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981] shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Email Support</h3>
                  <p className="text-2xl font-black text-gray-900 group-hover:text-[#10B981] transition-colors">laptopduniya77@gmail.com</p>
                  <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">Typical response time: Within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 group hover:border-[#25D366] transition-all">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">WhatsApp Alerts</h3>
                  <p className="text-2xl font-black text-gray-900 group-hover:text-[#25D366] transition-colors">Live Deal Broadcasts</p>
                  <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">Join our broadcast list for instant price drops.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200 border border-gray-100 group">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Our Office</h3>
                  <p className="text-2xl font-black text-gray-900">Porbandar, Gujarat</p>
                  <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">Pin Code: 362650, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Form Placeholder */}
          <div className="bg-gray-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-20 blur-3xl" />
             <h2 className="text-3xl font-black mb-8 italic tracking-tight">Quick Inquiry</h2>
             <form className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none block">Your Name</label>
                   <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-[#10B981] font-bold" placeholder="First Last" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none block">Email Address</label>
                   <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-[#10B981] font-bold" placeholder="mail@example.com" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none block">Message</label>
                   <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-[#10B981] font-bold min-h-[150px]" placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full bg-[#10B981] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-transform shadow-xl shadow-green-500/10 flex items-center justify-center gap-3">
                   <Send size={16} />
                   Send Message
                </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
}

