import React from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const navigate = useNavigate();
  const offers = [
    { title: 'Winter Escape 2026', discount: '20% OFF', desc: 'Escape the cold and save on all Maldives and Caribbean resort bookings. Valid for stays over 5 nights.', code: 'WINTER20' },
    { title: 'Early Bird Special', discount: '15% OFF', desc: 'Planning ahead? Book your 2027 summer vacation now and lock in massive discounts on all premium suites.', code: 'SUMMER27' },
    { title: 'Honeymoon Package', discount: 'FREE UPGRADE', desc: 'Celebrate your love with a complimentary room upgrade and a free bottle of champagne upon arrival.', code: 'LOVEUPGRADE' }
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Exclusive <span className="text-hotel-gold italic">Offers</span></h1>
        <p className="text-xl text-gray-400">Unlock VIP rates and premium perks on your next journey.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offers.map((offer, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-8 rounded-3xl flex flex-col justify-between border border-hotel-gold/20 hover:border-hotel-gold/60 transition-colors"
          >
            <div>
              <div className="inline-flex items-center bg-hotel-gold/10 text-hotel-gold font-bold px-3 py-1 rounded-full text-xs mb-6">
                <FaTag className="mr-2" /> {offer.discount}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{offer.title}</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">{offer.desc}</p>
            </div>
            
            <div className="border-t border-white/10 pt-6 mt-4">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Promo Code</p>
              <div className="bg-black/50 border border-white/20 rounded-lg p-3 text-center mb-6">
                <span className="font-mono text-white tracking-widest font-bold">{offer.code}</span>
              </div>
              <button onClick={() => navigate('/search')} className="btn-primary w-full py-3">Claim Offer</button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 text-center text-sm text-gray-500 flex items-center justify-center">
        <FaClock className="mr-2" /> Offers are subject to availability and blackout dates may apply.
      </div>
    </div>
  );
};

export default Offers;
