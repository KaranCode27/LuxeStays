import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaSpinner } from 'react-icons/fa';
import { useGetMyBookingsQuery } from '../../slices/bookingsApiSlice';
import { useCreateReviewMutation } from '../../slices/reviewsApiSlice';
import toast from 'react-hot-toast';

const UserFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');

  const { data: bookingsData, isLoading } = useGetMyBookingsQuery();
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const bookings = bookingsData?.data || [];
  const validBookings = bookings.filter(b => b.status !== 'Cancelled');
  const selectedBooking = validBookings.find(b => b._id === selectedBookingId) || validBookings[0];

  useEffect(() => {
    if (validBookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(validBookings[0]._id);
    }
  }, [validBookings, selectedBookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking?.hotelRef?._id) {
       toast.error('No valid hotel selected to review');
       return;
    }
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    
    try {
      await createReview({
        hotelId: selectedBooking.hotelRef._id,
        rating,
        comment
      }).unwrap();
      toast.success('Feedback submitted successfully. Thank you!');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-20 flex justify-center"><FaSpinner className="animate-spin text-3xl text-hotel-gold" /></div>;
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Rate Your Stay</h1>
        <p className="text-gray-400 mt-2">Your feedback helps us continuously elevate the LuxeStays standard.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-2xl">
        
        {validBookings.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl text-white mb-2">No Stays Found</h3>
            <p className="text-gray-400">You don't have any completed bookings to review yet.</p>
          </div>
        ) : (
          <>
            {/* Dropdown to select Booking */}
            {validBookings.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select a stay to review</label>
                <select 
                  value={selectedBookingId} 
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="glass-input w-full text-white bg-[#161925]"
                >
                  {validBookings.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.hotelRef?.name || 'Hotel'} ({new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-8 p-4 bg-[#161925] rounded-xl flex items-center gap-4 border border-white/5">
              <img src={selectedBooking?.hotelRef?.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=150'} alt="Hotel" className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h3 className="text-white font-medium">{selectedBooking?.hotelRef?.name || 'Loading Hotel...'}</h3>
                <p className="text-gray-400 text-sm">
                  Stay: {selectedBooking?.checkInDate ? new Date(selectedBooking.checkInDate).toLocaleDateString() : 'N/A'} - {selectedBooking?.checkOutDate ? new Date(selectedBooking.checkOutDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-widest">Overall Experience</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star}
                  className={`text-4xl cursor-pointer transition-colors ${
                    star <= (hoverRating || rating) ? 'text-hotel-gold' : 'text-gray-600'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            {rating > 0 && <p className="text-hotel-gold text-sm mt-3 font-medium">You selected {rating} out of 5 stars!</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tell us more about your experience</label>
            <textarea 
              rows="6" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass-input w-full resize-none text-white" 
              placeholder="What did you love? Was there anything we could have done better?"
            ></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting || validBookings.length === 0} className="btn-primary w-full py-4 text-lg flex justify-center items-center">
              {isSubmitting ? <><FaSpinner className="animate-spin mr-2" /> Submitting...</> : 'Submit Feedback'}
            </button>
          </div>
        </form>
        </>
        )}
      </motion.div>
    </div>
  );
};

export default UserFeedback;
