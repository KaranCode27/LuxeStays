import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="h-20 bg-hotel-card/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center w-1/2">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-hotel-gold focus:border-hotel-gold transition-all"
            placeholder="Search bookings, guests, or invoices..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-400 hover:text-hotel-gold transition-colors">
          <FaBell className="text-xl" />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hotel-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-hotel-gold border border-[#161925]"></span>
          </span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-white/10 pl-6 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-hotel-gold transition-colors">Admin User</p>
            <p className="text-xs text-gray-500">Super Administrator</p>
          </div>
          <FaUserCircle className="text-4xl text-gray-400 group-hover:text-hotel-gold transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;
