import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hotel-dark p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-10 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden">
        {success ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-gray-400 mb-6">Your password has been changed successfully. Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2">Create New Password</h2>
            <p className="text-gray-400 mb-8">Your new password must be different from previous used passwords.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-hotel-gold" />
                </div>
                <input type="password" className="glass-input w-full !pl-11 py-3" placeholder="New Password" required />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-hotel-gold" />
                </div>
                <input type="password" className="glass-input w-full !pl-11 py-3" placeholder="Confirm New Password" required />
              </div>
              <button type="submit" className="w-full btn-primary py-3">Reset Password</button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
