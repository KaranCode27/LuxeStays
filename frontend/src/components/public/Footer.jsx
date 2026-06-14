import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#05070a] pt-16 pb-8 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase mb-4">
              <span className="text-hotel-gold">Luxe</span>Stays
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Experience the pinnacle of luxury and comfort. We curate the finest hotels and resorts globally for an unforgettable stay.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-hotel-gold transition-colors"><FaFacebook className="text-xl" /></a>
              <a href="#" className="hover:text-hotel-gold transition-colors"><FaTwitter className="text-xl" /></a>
              <a href="#" className="hover:text-hotel-gold transition-colors"><FaInstagram className="text-xl" /></a>
              <a href="#" className="hover:text-hotel-gold transition-colors"><FaLinkedin className="text-xl" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/search" className="hover:text-hotel-gold transition-colors">Search Hotels</Link></li>
              <li><Link to="/about" className="hover:text-hotel-gold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-hotel-gold transition-colors">Contact Support</Link></li>
              <li><Link to="/user/invoice" className="hover:text-hotel-gold transition-colors">My Invoices</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Destinations</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-hotel-gold transition-colors">Maldives</a></li>
              <li><a href="#" className="hover:text-hotel-gold transition-colors">Swiss Alps</a></li>
              <li><a href="#" className="hover:text-hotel-gold transition-colors">Tokyo, Japan</a></li>
              <li><a href="#" className="hover:text-hotel-gold transition-colors">Paris, France</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive luxury travel updates and VIP offers.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/50 border border-white/10 rounded-l-lg px-4 py-2 w-full text-sm text-white focus:outline-none focus:border-hotel-gold"
              />
              <button type="submit" className="bg-hotel-gold hover:bg-hotel-accent text-black font-semibold px-4 rounded-r-lg transition-colors text-sm">
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} LuxeStays International. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
