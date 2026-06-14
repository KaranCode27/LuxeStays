import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { useGetHotelDetailsQuery } from '../slices/hotelsApiSlice';
import { useGetHotelRoomsQuery } from '../slices/roomsApiSlice';

const Booking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const names = userInfo?.name ? userInfo.name.split(' ') : [''];
  const first = names[0] || '';
  const last = names.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    firstName: first,
    lastName: last,
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    guests: 2,
    specialRequests: ''
  });

  // Correctly get local dates to avoid timezone UTC shift issues
  const getLocalDateString = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const tzOffsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffsetMs).toISOString().split('T')[0];
  };

  const today = getLocalDateString(0);
  const tomorrow = getLocalDateString(1);
  
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);

  const { data: hotelResponse, isLoading: isHotelLoading } = useGetHotelDetailsQuery(id);
  const { data: roomsData, isLoading: isRoomsLoading } = useGetHotelRoomsQuery(id);

  const hotel = hotelResponse?.data || hotelResponse;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (isHotelLoading || isRoomsLoading) {
    return <div className="text-white text-center py-20 text-2xl">Loading booking details...</div>;
  }

  const room = roomsData?.data?.[0] || {};
  const pricePerNight = room.price || hotel?.pricePerNight || 0;

  // Dynamically calculate nights
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };
  const nights = calculateNights();

  const basePrice = pricePerNight * nights * Number(formData.guests);
  const tax = basePrice * 0.1;
  const totalPrice = basePrice + tax;

  const handleConfirm = (e) => {
    e.preventDefault();
    const bookingPayload = {
      hotelRef: id,
      roomRef: room._id,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      guestCount: Number(formData.guests),
      totalPrice: totalPrice,
      paymentMethod: 'razorpay',
      guestName: `${formData.firstName} ${formData.lastName}`.trim(),
    };
    navigate('/payment', { state: { bookingPayload } });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Complete your booking</h1>
        <p className="text-gray-400 mt-2">Just a few more details to confirm your stay.</p>
      </motion.div>

      <form onSubmit={handleConfirm} className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-2/3 space-y-8">

          <div className="glass-panel p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Stay Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => {
                    let newDate = e.target.value;
                    if (newDate < today) newDate = today; // Strict JS clamp
                    setCheckInDate(newDate);
                    // Ensure checkout is strictly at least checkin date
                    if (newDate >= checkOutDate) {
                        const nextDay = new Date(new Date(newDate).getTime() + 86400000).toISOString().split('T')[0];
                        setCheckOutDate(nextDay); 
                    }
                  }}
                  min={today}
                  className="glass-input w-full text-white cursor-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => {
                    let newDate = e.target.value;
                    const minOut = checkInDate || today;
                    if (newDate <= minOut) {
                         const nextDay = new Date(new Date(minOut).getTime() + 86400000).toISOString().split('T')[0];
                         newDate = nextDay; 
                    }
                    setCheckOutDate(newDate);
                  }}
                  min={checkInDate ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split('T')[0] : tomorrow}
                  className="glass-input w-full text-white cursor-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Guests</label>
                <select name="guests" value={formData.guests} onChange={handleChange} className="glass-input w-full text-white bg-[#161925]" required>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Guest Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <div className="relative">
                  <FaUser className="absolute top-4 left-4 text-gray-600" />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="glass-input w-full !pl-11 text-white" placeholder="First Name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <div className="relative">
                  <FaUser className="absolute top-4 left-4 text-gray-600" />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="glass-input w-full !pl-11 text-white" placeholder="Last Name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute top-4 left-4 text-gray-600" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input w-full !pl-11 text-white" placeholder="john@gmail.com" />
                </div>
              </div>
              <div>
                <label className="font-medium text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute top-4 left-4 text-gray-600" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="glass-input w-full !pl-11 text-white" placeholder="+91 555 000 0000" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Special Requests (Optional)</label>
              <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="3" className="glass-input w-full resize-none" placeholder="Any dietary requirements, arrival time, or special needs?"></textarea>
            </div>
          </div>

          {/* Payment Section embedded physically inside Booking flow for UX */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-hotel-gold/30 relative">
            <div className="absolute top-6 right-6 text-green-400 flex items-center text-sm">
              <FaShieldAlt className="mr-1" /> Secure Encrypted
            </div>
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Payment Method</h2>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center justify-center space-x-1 text-2xl font-bold mb-4 tracking-tight">
                  <span className="text-[#3395FF]">Razor</span><span className="text-white">pay</span>
                </div>
                <p className="text-gray-300 px-4 text-sm">You will be securely authenticated by Razorpay's payment gateway to complete your transaction via UPI, NetBanking, or Cards.</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Summary Details */}
        <div className="w-full lg:w-1/3">
          <div className="glass-panel p-6 rounded-2xl sticky top-28 bg-[#161925]">
            <h2 className="text-lg font-bold text-white mb-4">Booking Summary</h2>

            <div className="mb-6 flex gap-4">
              <img src={hotel?.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=300'} alt="Room" className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="text-white font-medium">{hotel?.name || 'Loading...'}</h3>
                <p className="text-xs text-hotel-gold mt-1">{room?.type || 'Standard Room'}</p>
                <p className="text-xs text-gray-400">{hotel?.location}</p>
              </div>
            </div>

            <div className="border-t border-b border-white/10 py-4 mb-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Check-in</span>
                <span className="text-white font-medium">{checkInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Check-out</span>
                <span className="text-white font-medium">{checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Length of stay</span>
                <span className="text-white font-medium">{nights} Night{nights > 1 && 's'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Guests</span>
                <span className="text-white font-medium">{formData.guests} Guest{formData.guests > 1 && 's'}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">₹{pricePerNight.toFixed(2)} x {nights} night{nights > 1 && 's'} x {formData.guests} guest{formData.guests > 1 && 's'}</span>
                <span className="text-white">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxes & Fees (10%)</span>
                <span className="text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-white font-bold text-lg">Total Price</span>
                <span className="text-hotel-gold font-bold text-2xl">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary group">
              Confirm & Pay
              <FaArrowRight className="group-hover:translate-x-1 transition-transform ml-2 inline-block" />
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">By clicking Confirm & Pay, you agree to the Terms of Service.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Booking;
