import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import hotelImage from '../assets/hotel_exterior_night.png';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(`Welcome back, ${res.name}!`);
      
      // Send admins to the admin dashboard, and normal users to the home page
      if (res.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img 
          src={hotelImage} 
          alt="Luxury Hotel Exterior" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark via-transparent to-transparent flex flex-col justify-end p-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg"
          >
            A stay worth <span className="text-hotel-gold italic">remembering.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-200 text-lg max-w-md drop-shadow-md"
          >
            Log in to manage your luxury reservations, access exclusive perks, and experience seamless hospitality.
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative overflow-hidden bg-[#0A0D14]">
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-hotel-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10 glass-panel p-8 sm:p-10 rounded-2xl"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-hotel-textMuted">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@(gmail\.com|example\.com)$/i,
                      message: "Email must be @gmail.com or @example.com"
                    }
                  })}
                  className="glass-input w-full !pl-11"
                  placeholder="name@gmail.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  {...register("password", { required: "Password is required" })}
                  className="glass-input w-full !pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 bg-black border-white/20 rounded focus:ring-hotel-gold text-hotel-gold"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="text-hotel-gold hover:text-white transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary group mt-2 flex items-center justify-center gap-2">
              {isLoading ? (
                <>Logging In... <FaSpinner className="animate-spin" /></>
              ) : (
                <>Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-hotel-gold font-medium hover:text-white transition-colors duration-200">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
