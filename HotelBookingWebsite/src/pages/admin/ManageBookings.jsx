import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner } from 'react-icons/fa';
import { useGetBookingsQuery, useUpdateBookingStatusMutation } from '../../slices/bookingsApiSlice';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const { data: bookingsResponse, isLoading, refetch } = useGetBookingsQuery();
  const bookings = bookingsResponse?.data || [];
  
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ bookingId: id, status }).unwrap();
      toast.success(`Booking marked as ${status}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Bookings</h1>
          <p className="text-gray-400 mt-1">Review and manage guest reservations across all properties.</p>
        </div>
        <div className="flex gap-4">
          <select className="glass-input !py-2 !py-2 text-sm bg-[#161925] cursor-pointer">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
            <p>Loading booking records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/30 text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Booking ID</th>
                <th className="p-4 font-medium">Guest Name</th>
                <th className="p-4 font-medium">Hotel</th>
                <th className="p-4 font-medium">Dates (2026)</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-hotel-gold text-xs">{booking._id?.substring(0,8).toUpperCase()}</td>
                  <td className="p-4 font-medium text-white">{booking.guestName || booking.userRef?.name || 'Guest'}</td>
                  <td className="p-4 text-gray-400">{booking.hotelRef?.name || 'Hotel'}</td>
                  <td className="p-4 text-gray-400">{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</td>
                  <td className="p-4 font-medium text-white">₹{booking.totalPrice?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${
                      booking.status === 'confirmed' || booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' : 
                      booking.status === 'pending' || booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-3">
                    <button onClick={() => setSelectedBooking(booking)} className="text-gray-400 hover:text-white transition-colors" title="View Details">
                      <FaEye className="text-lg" />
                    </button>
                    {(booking.status === 'pending' || booking.status === 'Pending') && (
                      <button onClick={() => handleStatusChange(booking._id, 'Confirmed')} className="text-gray-400 hover:text-green-400 transition-colors" title="Approve">
                        <FaCheckCircle className="text-lg" />
                      </button>
                    )}
                    <button onClick={() => handleStatusChange(booking._id, 'Cancelled')} className="text-gray-400 hover:text-red-400 transition-colors" title="Cancel Booking">
                      <FaTimesCircle className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#161925] border border-hotel-gold/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <FaTimesCircle className="text-2xl" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            
            <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Transaction ID</span>
                 <span className="text-hotel-gold font-mono">{selectedBooking._id}</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Primary Guest</span>
                 <span className="text-white font-medium">{selectedBooking.guestName || selectedBooking.userRef?.name}</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Booked Property</span>
                 <span className="text-white font-medium">{selectedBooking.hotelRef?.name}</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Room Number</span>
                 <span className="text-white">{selectedBooking.roomRef?.roomNumber || 'Not assigned'}</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Number of Guests</span>
                 <span className="text-white">{selectedBooking.guestCount || 1} Guests</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-gray-400">Duration</span>
                 <span className="text-white">{formatDate(selectedBooking.checkInDate)} to {formatDate(selectedBooking.checkOutDate)}</span>
               </div>
               <div className="flex justify-between pt-2">
                 <span className="text-gray-400">Total Charged</span>
                 <span className="text-hotel-gold font-bold text-lg">₹{selectedBooking.totalPrice?.toLocaleString()}</span>
               </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
              <button onClick={() => setSelectedBooking(null)} className="px-6 py-2 rounded-lg text-white font-medium hover:bg-white/5 transition-colors border border-white/20">Close Details</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageBookings;
