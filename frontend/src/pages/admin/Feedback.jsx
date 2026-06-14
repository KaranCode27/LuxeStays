import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaSpinner, FaTrash } from 'react-icons/fa';
import { useGetAllReviewsQuery, useDeleteReviewMutation } from '../../slices/reviewsApiSlice';
import toast from 'react-hot-toast';

const Feedback = () => {
  const { data: reviewsData, isLoading } = useGetAllReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  
  const reviews = reviewsData?.data || [];

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
       try {
          await deleteReview(reviewId).unwrap();
          toast.success('Review deleted successfully');
       } catch (err) {
          toast.error(err?.data?.message || 'Failed to delete review');
       }
    }
  };

  if (isLoading) {
    return <div className="text-white text-center py-20 flex justify-center"><FaSpinner className="animate-spin text-3xl text-hotel-gold" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Guest Feedback</h1>
          <p className="text-gray-400 mt-1">Review ratings and manage public testimonials across all properties.</p>
        </div>
        <div className="text-hotel-gold text-lg font-bold">
            Total Reviews: {reviews.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 glass-panel rounded-xl">
             <p className="text-gray-400">No reviews have been submitted by guests yet.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-[#161925] p-4 rounded-xl text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white mb-1 flex justify-center items-center gap-1">
                  {review.rating} <FaStar className="text-hotel-gold text-xl" />
                </div>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.userRef?.name || review.name || 'Anonymous Guest'}</h3>
                    <p className="text-xs text-hotel-gold">{review.hotelRef?.name || review.propertyName}</p>
                  </div>
                  <span className="text-xs text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <p className="text-gray-300 italic">"{review.comment}"</p>
                
                <div className="mt-4 flex gap-3">
                  <button 
                     onClick={() => handleDelete(review._id)}
                     disabled={isDeleting}
                     className="text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                  >
                     <FaTrash /> Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Feedback;
