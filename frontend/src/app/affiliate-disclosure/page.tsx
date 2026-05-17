import React from 'react';
import { DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AffiliateDisclosurePage() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10B981]">
              <DollarSign size={24} />
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic underline decoration-[#10B981] decoration-4 underline-offset-8">Affiliate Disclosure</h1>
        </div>

        <div className="prose prose-emerald lg:prose-xl max-w-none text-gray-600 font-bold leading-relaxed space-y-8">
          <p>Transparency is the cornerstone of <strong>Laptop Duniya</strong>. We want you to understand how we keep the lights on while providing free, high-quality content and tools.</p>
          
          <div className="bg-[#10B981] bg-opacity-5 p-10 rounded-[2.5rem] border border-[#10B981] border-opacity-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] opacity-10 blur-3xl" />
             <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <ShieldCheck className="text-[#10B981]" />
                How It Works
             </h2>
             <p className="mb-0">Laptop Duniya is a participant in the amazon services LLC associates program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to amazon.com, amazon.in, and other regional Amazon stores, as well as Flipkart.com.</p>
          </div>

          <p>When you click on a deal or a price link on our site and make a purchase, we may receive a small commission from the retailer. <strong>This does not change the price you pay.</strong> In fact, we often find coupons that make it cheaper!</p>

          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mt-12 mb-6">Our Commitment to Content</h3>
          <ul className="space-y-4 list-none p-0">
             <li className="flex gap-4"><CheckCircle2 className="text-[#10B981] shrink-0" size={24} /> <span><strong>Independence:</strong> Commissions never influence our editorial ratings. If a laptop is bad, we'll say so.</span></li>
             <li className="flex gap-4"><CheckCircle2 className="text-[#10B981] shrink-0" size={24} /> <span><strong>Accuracy:</strong> We prioritize showing the best deal for YOU, even if it's from a store that doesn't pay us.</span></li>
          </ul>

          <div className="pt-12 border-t border-gray-100">
             <p className="text-sm italic">If you have any questions about our affiliate partnerships, please reach out to <strong>laptopduniya77@gmail.com</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
