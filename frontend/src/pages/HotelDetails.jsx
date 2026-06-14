import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool, FaConciergeBell, FaSpa, FaCheck } from 'react-icons/fa';
import { useGetHotelDetailsQuery } from '../slices/hotelsApiSlice';
import suiteImg from '../assets/hotel_superior_suite.png';

const HotelDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: responseData, isLoading, error } = useGetHotelDetailsQuery(id);
  const hotel = responseData?.data || responseData;

  if (isLoading) return <div className="text-white text-center py-20 text-2xl">Loading hotel details...</div>;
  if (error) return <div className="text-red-500 text-center py-20 text-2xl">{error?.data?.message || error.error || 'Failed to load hotel'}</div>;

  return (
    <div className="pb-20 font-sans">
      {/* Hero Image */}
      <div className="relative h-[60vh] w-full">
        <img src={hotel?.images?.[0] || suiteImg} alt={hotel?.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto flex justify-between items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex text-hotel-gold mb-2 text-sm">
              {[...Array(hotel?.starRating || 5)].map((_, i) => <FaStar key={i} />)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{hotel?.name || "Premium Resort"}</h1>
            <p className="text-gray-200 flex items-center text-lg drop-shadow-md"><FaMapMarkerAlt className="mr-2 text-hotel-gold"/> {hotel?.location || "Unknown Location"}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="hidden sm:block text-right bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20">
             <p className="text-sm text-gray-300">Excellent</p>
             <p className="text-2xl font-bold text-white">9.8 <span className="text-sm font-normal text-gray-400">/10</span></p>
             <p className="text-xs text-gray-400 mt-1">124 reviews</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-400 leading-relaxed">
              {hotel?.description || "Description not available."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {hotel?.amenities?.length > 0 ? hotel.amenities.map((item, i) => (
                 <div key={i} className="flex items-center text-gray-300 p-3 bg-white/5 rounded-lg border border-white/5 hover:border-hotel-gold/30 transition-colors">
                   <FaCheck className="text-hotel-gold text-xl mr-3" />
                   <span className="text-sm font-medium">{item}</span>
                 </div>
               )) : (
                 <p className="text-gray-400 col-span-2 sm:col-span-3 italic">Detailed amenities information is currently not available for this property. Please contact the hotel desk directly for specific inquiries.</p>
               )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Available Rooms</h2>
            <div className="glass-panel p-6 rounded-2xl border border-hotel-gold/20 flex flex-col sm:flex-row justify-between items-center gap-6">
               <div className="w-full sm:w-1/3 h-32 bg-gray-800 rounded-lg overflow-hidden">
                 <img src={hotel?.images?.[0] || suiteImg} alt="Room" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 w-full">
                 <h3 className="text-xl font-bold text-white mb-1">Superior Water Villa</h3>
                 <p className="text-xs text-gray-400 mb-3 flex items-center gap-4">
                   <span>1 King Bed</span> <span>•</span> <span>150 sq.m</span>
                 </p>
                 <ul className="text-sm text-green-400 space-y-1">
                   <li className="flex items-center"><FaCheck className="mr-2 text-xs" /> Breakfast included</li>
                   <li className="flex items-center"><FaCheck className="mr-2 text-xs" /> Free cancellation before Oct 10</li>
                 </ul>
               </div>
               <div className="w-full sm:w-auto text-right">
                 <div className="text-3xl font-bold text-white mb-1"><span className="text-sm text-gray-400 font-normal mr-1">Price:</span>₹{Number(hotel?.pricePerNight).toLocaleString('en-IN')}</div>
                 <p className="text-xs text-gray-500 mb-4">per night includes taxes</p>
                 <button onClick={() => navigate(`/book/${id}`)} className="btn-primary w-full py-2">Select Room</button>
               </div>
            </div>
          </section>
        </div>

        {/* Floating Booking Widget */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl sticky top-28 border border-hotel-gold/30">
            <div className="text-3xl font-bold text-white mb-1"><span className="text-sm text-gray-400 font-normal mr-1">Price:</span>₹{Number(hotel?.pricePerNight).toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-400">/night</span></div>
            <p className="text-xs text-green-400 mb-6 flex items-center"><FaCheck className="mr-1"/> Best Price Guaranteed</p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-black/50 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Check-in / Check-out</p>
                <p className="text-white font-medium">Oct 12, 2026 - Oct 15, 2026</p>
              </div>
              <div className="bg-black/50 p-3 rounded-lg border border-white/10">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Guests</p>
                <p className="text-white font-medium">2 Adults, 0 Children</p>
              </div>
            </div>
            
            <button onClick={() => navigate(`/book/${id}`)} className="btn-primary w-full py-3 text-lg mb-4">Reserve Now</button>
            <p className="text-center text-xs text-gray-500">You won't be charged yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
