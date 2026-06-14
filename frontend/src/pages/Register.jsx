import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import hotelImage from '../assets/hotel_room_ocean.png';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [registerUser, { isLoading }] = useRegisterMutation();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({ 
        name: `${data.firstName} ${data.lastName}`, 
        email: data.email, 
        password: data.password 
      }).unwrap();
      
      dispatch(setCredentials({ ...res }));
      toast.success('Account created successfully!');
      navigate('/'); // Immediately redirect to home page
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img 
          src={hotelImage} 
          alt="Luxury Ocean View Room" 
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark via-transparent to-transparent flex flex-col justify-end p-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Your ultimate <span className="text-hotel-gold italic">getaway</span> begins here.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-200 text-lg max-w-md drop-shadow-md"
          >
            Join our exclusive club for seamless bookings, premium upgrades, and unforgettable experiences.
          </motion.p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative overflow-hidden bg-[#0A0D14] min-h-screen">
        {/* Abstract Background Orbs */}
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-hotel-gold/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg relative z-10 glass-panel p-8 sm:p-10 rounded-2xl my-8"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-hotel-textMuted">Become a privileged member today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    {...register("firstName", { required: "First name is required" })}
                    className="glass-input w-full !pl-11"
                    placeholder="First Name"
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    {...register("lastName", { required: "Last name is required" })}
                    className="glass-input w-full !pl-11"
                    placeholder="Last Name"
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

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
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" }
                  })}
                  className="glass-input w-full !pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  className="glass-input w-full !pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary group mt-4 flex justify-center items-center gap-2">
              {isLoading ? (
                <>Processing... <FaSpinner className="animate-spin" /></>
              ) : (
                <>Create Account <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-hotel-gold font-medium hover:text-white transition-colors duration-200">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
