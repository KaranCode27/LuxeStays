import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import hotelImage from '../assets/hotel_exterior_night.png';

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex text-gray-200">
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${hotelImage})` }}>
        <div className="flex items-center justify-center w-full bg-black/60 backdrop-blur-sm shadow-2xl p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-xl"><span className="text-hotel-gold border-r-4 border-hotel-gold pr-4 mr-4">Luxe</span>Stays</h1>
            <p className="text-xl text-gray-300">Don't worry. We will help you regain your access to the world's most luxurious destinations.</p>
          </div>
        </div>
      </div>
      
      <div className="relative w-full lg:w-1/2 flex items-center justify-center bg-[#0B0E14] p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <button onClick={() => navigate('/login')} className="flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm">
            <FaArrowLeft className="mr-2" /> Back to sign in
          </button>
          
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 mb-8">Enter the email associated with your account and we'll send you a link to reset your password.</p>
          
          <form className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-hotel-gold" />
              </div>
              <input type="email" className="glass-input w-full !pl-11 py-3" placeholder="name@gmail.com" required />
            </div>
            <button type="button" onClick={() => navigate('/reset-password')} className="w-full btn-primary py-3">Send Reset Link</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
