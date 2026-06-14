import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutApiCallMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { FaCalendarAlt, FaUserFriends, FaSearch, FaMapMarkerAlt, FaUserCircle, FaAngleDown } from 'react-icons/fa';
import heroBg from '../assets/agoda_hero_resort.png';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutApiCallMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [destination, setDestination] = useState('');

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-hotel-dark overflow-hidden font-sans">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-white tracking-widest mr-10"><span className="text-hotel-gold">Luxe</span>Stays</h1>
          
          <div className="hidden md:flex space-x-8 text-sm font-semibold">
            <button onClick={() => navigate('/search')} className="text-gray-200 hover:text-white hover:underline decoration-hotel-gold decoration-2 underline-offset-4 transition-all">Hotel</button>
            <button onClick={() => navigate('/faq')} className="text-gray-200 hover:text-white hover:underline decoration-hotel-gold decoration-2 underline-offset-4 transition-all">FAQ</button>
            <button onClick={() => navigate('/about')} className="text-gray-200 hover:text-white hover:underline decoration-hotel-gold decoration-2 underline-offset-4 transition-all">About Us</button>
            <button onClick={() => navigate('/contact')} className="text-gray-200 hover:text-white hover:underline decoration-hotel-gold decoration-2 underline-offset-4 transition-all">Contact Us</button>
          </div>
        </div>

        <div className="flex gap-4 items-center relative">
          {userInfo ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center gap-2 text-white hover:text-hotel-gold transition-colors font-medium bg-black/20 px-4 py-2 rounded-full border border-white/10"
              >
                <FaUserCircle className="text-xl" />
                <span>{userInfo.name.split(' ')[0]}</span>
                <FaAngleDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-hotel-card border border-white/10 divide-y divide-white/10">
                  <div className="py-1">
                    <button 
                      onClick={() => { setDropdownOpen(false); navigate(userInfo.role === 'admin' ? '/admin/dashboard' : '/user/profile'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      Dashboard
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 font-medium"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-white hover:text-hotel-gold font-medium px-4 transition-colors hidden sm:block">Sign In</button>
              <button onClick={() => navigate('/register')} className="bg-hotel-gold hover:bg-hotel-accent text-black font-semibold py-2 px-6 rounded-lg transition-transform active:scale-95">Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Tropical Resort" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-hotel-dark/90"></div>
        </div>

        <div className="relative z-10 w-full px-4 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl">
              Find your next <span className="text-hotel-gold italic drop-shadow-2xl">paradise.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-md">Book directly and unlock exclusive luxury rewards.</p>
          </motion.div>

          {/* Agoda style search widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-5xl glass-panel p-3 md:p-4 rounded-3xl flex flex-col md:flex-row gap-2 shadow-2xl"
          >
            {/* Destination */}
            <div className="flex-1 relative bg-black/40 rounded-2xl flex items-center px-4 py-4 md:py-0 border border-transparent hover:border-hotel-gold/30 transition-colors cursor-text">
              <FaMapMarkerAlt className="text-hotel-gold text-xl mr-3" />
              <div className="flex flex-col w-full">
                <span className="text-xs text-gray-400 font-medium">Destination or property</span>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent text-white focus:outline-none font-semibold w-full" 
                  placeholder="Where are you going?" 
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex-1 relative bg-black/40 rounded-2xl flex items-center px-4 py-4 md:py-3 border border-transparent hover:border-hotel-gold/30 transition-colors cursor-pointer">
              <FaCalendarAlt className="text-hotel-gold text-xl mr-3" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Check-in — Check-out</span>
                <span className="text-white font-semibold">Oct 12 — Oct 15</span>
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 relative bg-black/40 rounded-2xl flex items-center px-4 py-4 md:py-3 border border-transparent hover:border-hotel-gold/30 transition-colors cursor-pointer">
              <FaUserFriends className="text-hotel-gold text-xl mr-3" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-medium">Guests & Rooms</span>
                <span className="text-white font-semibold">2 Adults, 1 Room</span>
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={() => navigate('/search', { state: { destination } })}
              className="bg-hotel-gold hover:bg-hotel-accent text-black p-4 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-hotel-gold/20 md:w-32"
            >
              <span className="font-bold text-lg hidden max-md:block mr-2">Search</span>
              <FaSearch className="text-2xl" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
