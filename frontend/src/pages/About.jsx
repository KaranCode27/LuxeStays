import React from 'react';
import { motion } from 'framer-motion';
import aboutImage from '../assets/agoda_hero_resort.png';

const About = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Redefining <span className="text-hotel-gold italic">Luxury.</span></h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-400">
          LuxeStays is a global portfolio of the world's most extraordinary hotels and resorts, meticulously curated to deliver unparalleled service and architectural brilliance to the most discerning travelers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img 
            src={aboutImage} 
            alt="LuxeStays Concept" 
            className="rounded-2xl shadow-2xl border border-white/10"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              We believe travel is not just about the destination, but where you rest your head. Our platform bridges the gap between boutique, premium independent properties and guests who seek more than just a bed—they seek an experience.
            </p>
          </div>
          <div className="w-16 h-1 bg-hotel-gold/50 rounded"></div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Uncompromising Quality</h3>
            <p className="text-gray-400 leading-relaxed">
              From the Maldives to the Swiss Alps, every property listed on LuxeStays undergoes a rigorous 250-point inspection covering privacy, comfort, culinary excellence, and aesthetic perfection.
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="bg-[#161925] border border-white/5 rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to embark on a journey?</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of elite travelers who trust us with their vacations.</p>
        <button className="btn-primary inline-flex">Explore Destinations</button>
      </div>
    </div>
  );
};

export default About;
