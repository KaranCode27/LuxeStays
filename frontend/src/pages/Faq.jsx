import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const Faq = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { q: "What is LuxeStays' cancellation policy?", a: "Most bookings can be cancelled free of charge up to 48 hours before check-in. However, specific policies depend on the property and the rate type selected during checkout." },
    { q: "Are taxes and fees included in the displayed price?", a: "The initial search price shows the base nightly rate. All applicable taxes, resort fees, and service charges are clearly itemized on the final booking summary page before you pay." },
    { q: "Is my payment information secure?", a: "Yes. All transactions are securely processed using bank-level 256-bit AES encryption. LuxeStays does not store your raw credit card data on our servers." },
    { q: "Can I request special accommodations?", a: "Absolutely! There is a 'Special Requests' field on the booking page. We forward these directly to the hotel concierge to ensure your stay is perfect." },
    { q: "Do you offer a loyalty or rewards program?", a: "Yes, by registering an account you automatically join the LuxeCircle, allowing you to earn points on every booking which can be redeemed for room upgrades and spa credits." }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[75vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-lg">Everything you need to know about booking with LuxeStays.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="glass-panel border-white/5 rounded-xl overflow-hidden">
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)} 
              className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
            >
              <span className="text-lg font-medium text-white">{faq.q}</span>
              <FaChevronDown className={`text-hotel-gold transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {openIdx === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-gray-400"
                >
                  <p className="border-t border-white/10 pt-4">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
