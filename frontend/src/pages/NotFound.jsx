import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans text-center relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none text-[30vw] font-black text-hotel-gold overflow-hidden">
        404
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-8 max-w-lg"
      >
        <h1 className="text-6xl font-bold text-white mb-4">Are you lost?</h1>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          The page you're looking for has drifted out to sea or doesn't exist. Let's get you back to familiar shores.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="btn-primary px-8 py-4 text-lg"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
