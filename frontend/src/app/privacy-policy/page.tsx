import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white pb-24">
      {/* Header */}
      <section className="bg-gray-900 text-white py-24 mb-16 rounded-b-[4rem]">
        <div className="max-w-[1140px] mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-[#10B981] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
            <Shield size={40} />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight uppercase italic">Privacy Policy</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Last Updated: April 12, 2026</p>
        </div>
      </section>

      <div className="max-w-[800px] mx-auto px-4">
        <div className="prose prose-emerald lg:prose-xl max-w-none text-gray-600 font-bold leading-relaxed">
          <section className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic border-l-4 border-[#10B981] pl-6 uppercase tracking-tight">Introduction</h2>
            <p>Welcome to Laptop Duniya. We value your privacy and are committed to protecting your personal data. This privacy policy informs you how we look after your data when you visit our website and tells you about your privacy rights.</p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic border-l-4 border-[#10B981] pl-6 uppercase tracking-tight">Data We Collect</h2>
            <ul className="space-y-4 list-none p-0">
               <li className="flex gap-4"><Lock className="text-[#10B981] shrink-0" size={24} /> <span><strong>Contact Data:</strong> Name and email provided via newsletter or contact forms.</span></li>
               <li className="flex gap-4"><Eye className="text-[#10B981] shrink-0" size={24} /> <span><strong>Technical Data:</strong> IP address, browser type, and location used for site analytics.</span></li>
               <li className="flex gap-4"><FileText className="text-[#10B981] shrink-0" size={24} /> <span><strong>Subscription Data:</strong> Browser push tokens for real-time deal alerts.</span></li>
            </ul>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic border-l-4 border-[#10B981] pl-6 uppercase tracking-tight">How We Use Your Data</h2>
            <p>We only use your data to improve your experience, send requested price alerts, and manage the Newsletter subscription you have opted into. We DO NOT sell your data to third parties.</p>
          </section>

          <section className="mb-16 bg-emerald-50/50 p-10 rounded-[3rem] border border-emerald-100/50">
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic border-l-4 border-[#10B981] pl-6 uppercase tracking-tight text-[#115e59]">Cookies & Third-Party Advertising</h2>
            <p className="mb-6">Laptop Duniya uses cookies to store information about visitors' preferences and to record user-specific information on which pages the user accesses or visits.</p>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2.5 shrink-0"></div>
                  <p><strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DoubleClick cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2.5 shrink-0"></div>
                  <p><strong>Opt-Out:</strong> Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the Google ad and content network privacy policy.</p>
               </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-6 italic border-l-4 border-[#10B981] pl-6 uppercase tracking-tight">Contact Us</h2>
            <p>For any privacy-related questions, please contact us at:</p>
            <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 mt-6 font-black text-[#10B981] text-xl">
               laptopduniya77@gmail.com
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
