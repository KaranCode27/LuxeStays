import React from 'react';

const Terms = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-300 font-sans min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 2026</p>

      <div className="space-y-8 glass-panel p-8 md:p-12 rounded-3xl text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using LuxeStays ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Booking Policies</h2>
          <p className="mb-2">All bookings made through the Platform are subject to the specific property's availability and acceptance. LuxeStays acts solely as an intermediary between you and the accommodation provider.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>You must be at least 18 years of age to make a booking.</li>
            <li>Valid credit card information is required to secure reservations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Pricing and Payments</h2>
          <p>Prices displayed are dynamically updated in real-time. We reserve the right to correct any pricing errors. Your card will be charged immediately upon booking confirmation unless the "Pay at Property" option is explicitly selected.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Liability Disclaimer</h2>
          <p>LuxeStays is not liable for injury, loss, or damage incurred during your stay at any listed property. Properties operate independently and are exclusively responsible for their premises and services provided to you.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
