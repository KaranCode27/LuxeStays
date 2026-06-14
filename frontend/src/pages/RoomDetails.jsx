import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBed, FaWifi, FaCoffee, FaTv, FaBath, FaArrowLeft, FaCheck } from 'react-icons/fa';
import suiteImg from '../assets/hotel_superior_suite.png';

const RoomDetails = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="flex items-center text-hotel-gold hover:text-white transition-colors mb-6 text-sm font-medium">
        <FaArrowLeft className="mr-2" /> Back to Hotel
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <img src={suiteImg} alt="Superior Water Villa" className="w-full h-[500px] object-cover rounded-2xl shadow-2xl border border-white/10" />
        </div>
        
        <div className="flex flex-col justify-center">
          <div className="bg-hotel-gold/10 text-hotel-gold text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">Premium Tier</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Superior Water Villa</h1>
          <p className="text-xl text-gray-400 mb-6">150 sq.m • Suspended over the ocean</p>
          <p className="text-gray-300 leading-relaxed mb-8">
            This exceptional overwater villa offers uninterrupted views of the endless horizon. Step straight into the lagoon from your private sun deck or relax in the cantilevered hammock. Featuring a glass-bottomed floor panel, you can watch exotic marine life glide by from the comfort of your living room.
          </p>
          <div className="flex items-end gap-6 border-t border-white/10 pt-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Price per night</p>
              <p className="text-4xl font-bold text-white">₹850</p>
            </div>
            <button onClick={() => navigate('/book/1')} className="btn-primary flex-1 py-4 text-lg">Reserve this room</button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="glass-panel p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Room Amenities</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-300"><FaBed className="text-hotel-gold mr-3"/> 1 King Bed</div>
            <div className="flex items-center text-gray-300"><FaWifi className="text-hotel-gold mr-3"/> High-Speed Wifi</div>
            <div className="flex items-center text-gray-300"><FaBath className="text-hotel-gold mr-3"/> Deep Soaking Tub</div>
            <div className="flex items-center text-gray-300"><FaTv className="text-hotel-gold mr-3"/> 65" OLED TV</div>
            <div className="flex items-center text-gray-300"><FaCoffee className="text-hotel-gold mr-3"/> Espresso Machine</div>
            <div className="flex items-center text-gray-300"><FaCheck className="text-hotel-gold mr-3"/> 24/7 Butler</div>
          </div>
        </section>

        <section className="glass-panel p-8 rounded-2xl bg-[#161925]">
          <h2 className="text-2xl font-bold text-white mb-6">Included Services</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="p-1 bg-green-500/20 text-green-400 rounded mr-4 mt-0.5"><FaCheck className="text-xs"/></div>
              <div>
                <h4 className="text-white font-medium">Complimentary Breakfast</h4>
                <p className="text-sm text-gray-400">Available in-villa or at the main dining pavilion.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="p-1 bg-green-500/20 text-green-400 rounded mr-4 mt-0.5"><FaCheck className="text-xs"/></div>
              <div>
                <h4 className="text-white font-medium">Airport Transfer</h4>
                <p className="text-sm text-gray-400">Round-trip scenic seaplane transfer included.</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RoomDetails;
