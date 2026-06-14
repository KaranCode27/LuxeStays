import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useGetMyBookingsQuery } from '../../slices/bookingsApiSlice';

const MyBookings = () => {
  const navigate = useNavigate();
  const { data: bookingsResponse, isLoading } = useGetMyBookingsQuery();
  const bookings = bookingsResponse?.data || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400">
        <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
        <p>Loading your past and upcoming trips...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 mt-1">View your upcoming trips and past stays.</p>
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl text-gray-400">
            <p>You have no bookings yet. Start exploring our properties to plan your next trip!</p>
          </div>
        ) : bookings.map((bkg) => (
          <div key={bkg._id} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center hover:border-hotel-gold/30 transition-colors cursor-pointer group" onClick={() => navigate(`/user/bookings/${bkg._id}`)}>
            <img src={bkg.hotelRef?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'} alt="Hotel" className="w-full sm:w-32 h-24 object-cover rounded-xl" />
            
            <div className="flex-1 w-full text-left">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-bold text-white group-hover:text-hotel-gold transition-colors">{bkg.hotelRef?.name || 'Hotel'}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (bkg.status || '').toLowerCase() === 'pending' || (bkg.status || '').toLowerCase() === 'confirmed' ? 'bg-hotel-gold/20 text-hotel-gold' : 'bg-gray-600/30 text-gray-400'
                }`}>
                  {bkg.status || 'Pending'}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{formatDate(bkg.checkInDate)} - {formatDate(bkg.checkOutDate)}</p>
              <div className="flex justify-between items-end">
                <p className="text-white font-medium">₹{bkg.totalPrice?.toLocaleString()}</p>
                <div className="text-hotel-gold flex items-center text-sm font-medium">View Details <FaChevronRight className="ml-1 text-xs" /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyBookings;
