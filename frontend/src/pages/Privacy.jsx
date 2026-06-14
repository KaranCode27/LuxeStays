import React from 'react';

const Privacy = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-300 font-sans min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 2026</p>

      <div className="space-y-8 glass-panel p-8 md:p-12 rounded-3xl text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
          <p className="mb-2">We collect information that you manually provide to us when booking, registering, or contacting support. This includes:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400 mb-4">
            <li>Personal identifiers (Name, Email, Phone Number, Date of Birth).</li>
            <li>Financial information (Credit card details, deeply encrypted via Stripe).</li>
            <li>Travel preferences and booking history.</li>
          </ul>
          <p>We also automatically collect technical data such as IP addresses and browsing behavior using cookies to optimize our website.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Data</h2>
          <p>We strictly use your data to process your reservations, communicate strictly regarding your upcoming travels, and personalize your experience on LuxeStays. We do NOT sell your data to third-party data brokers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Data Security</h2>
          <p>Your privacy is paramount. We implement state-of-the-art server firewalls and 256-bit AES encryption to protect your sensitive information against unauthorized access, alteration, or destruction.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
