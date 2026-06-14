import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useToggleWishlistMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { FaHeart, FaMapMarkerAlt, FaStar, FaRegHeart } from 'react-icons/fa';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleToggleWishlist = async (hotelId) => {
    try {
      const res = await toggleWishlist({ hotelId }).unwrap();
      dispatch(setCredentials({ ...userInfo, wishlist: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const wishlist = userInfo?.wishlist || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">Wishlist <FaHeart className="text-red-500" /></h1>
          <p className="text-gray-400 mt-1">Properties you've saved for future adventures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlist.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-xl text-white font-bold mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-400 mb-6">Start exploring our properties and save your favorites here.</p>
            <button onClick={() => navigate('/search')} className="btn-primary px-8 py-2">Explore Hotels</button>
          </div>
        ) : wishlist.map((item, idx) => (
          <motion.div 
            key={item._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => navigate(`/hotel/${item._id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
            <img src={item.images?.[0] || 'https://via.placeholder.com/400x300'} alt={item.name} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleToggleWishlist(item._id); }}
              className="absolute top-4 right-4 z-20 p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors"
            >
              {userInfo?.wishlist?.some(w => (typeof w === 'object' ? w._id === item._id : w === item._id)) ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-white text-lg" />
              )}
            </button>

            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
              <p className="text-gray-300 text-sm flex items-center mb-3"><FaMapMarkerAlt className="mr-1 text-hotel-gold"/> {item.location}</p>
              <div className="flex justify-between items-center">
                 <div className="flex bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs items-center border border-white/10 w-fit">
                    <span className="font-bold text-white mr-1">{item.starRating || 0}.0</span> <FaStar className="text-hotel-gold" />
                 </div>
                 <div className="text-right">
                    <span className="text-xl font-bold text-white">₹{item.pricePerNight}</span>
                    <span className="text-xs text-gray-400">/night</span>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Wishlist;
