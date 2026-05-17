import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-[800px] mx-auto px-4">
        <h1 className="text-5xl font-black text-gray-900 mb-12 tracking-tight uppercase italic">Terms & Conditions</h1>
        
        <div className="space-y-12 text-gray-600 font-bold leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">1. Acceptance of Terms</h2>
            <p>By accessing and using Laptop Duniya, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">2. Accuracy of Information</h2>
            <p>While we strive for 100% accuracy, laptop specifications, prices, and availability are subject to change. We are not responsible for errors in retailer listings or outdated prices.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">3. Content Ownership</h2>
            <p>All content including reviews, comparison logic, and layout are the intellectual property of Laptop Duniya. Unauthorized reproduction is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">4. User Conduct</h2>
            <p>Users are expected to use our automated alert and newsletter systems responsibly. Any attempt to disrupt the site's technical infrastructure will result in a permanent ban.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest">5. Monetization & Advertising</h2>
            <p>Laptop Duniya is a commercially supported platform. We utilize affiliate marketing and third-party advertising (including Google AdSense) to generate revenue. By using this site, you acknowledge that certain links and content may be sponsored or commission-based.</p>
          </section>

          <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-widest text-[#10B981]">5. Contact</h2>
            <p>For any legal inquiries regarding these terms, please contact: <strong>laptopduniya77@gmail.com</strong></p>
          </section>
        </div>
      </div>
    </div>
  );
}
