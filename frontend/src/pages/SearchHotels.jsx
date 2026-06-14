import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useGetHotelsQuery } from '../slices/hotelsApiSlice';
import { useToggleWishlistMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const SearchHotels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialDestination = location.state?.destination || '';
  
  const [destination, setDestination] = useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState(initialDestination);

  useEffect(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination);
      setSearchQuery(location.state.destination);
    }
  }, [location.state?.destination]);
  
  // Filters & Sorting state
  const [sortOrder, setSortOrder] = useState('none');
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [toggleWishlist] = useToggleWishlistMutation();

  const handleToggleWishlist = async (hotelId) => {
    if (!userInfo) {
       navigate('/login');
       return;
    }
    try {
      const res = await toggleWishlist({ hotelId }).unwrap();
      // Update local storage with new wishlist
      dispatch(setCredentials({ ...userInfo, wishlist: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch hotels from our backend
  const { data, isLoading, error } = useGetHotelsQuery({ limit: 100 });
  
  // Provide fallback or real data
  const hotels = data?.data || [];

  // Filter logic
  let filteredHotels = hotels.filter((hotel) => {
    // 1. Text Search
    const matchesDest = hotel.location?.toLowerCase().includes(searchQuery.toLowerCase()) || hotel.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Star Filter
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(hotel.starRating || 0);

    // 3. Amenities Filter
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => hotel.amenities?.includes(amenity));

    return matchesDest && matchesStars && matchesAmenities;
  });

  // Sorting Logic
  if (sortOrder === 'price_asc') {
    filteredHotels = [...filteredHotels].sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
  } else if (sortOrder === 'price_desc') {
    filteredHotels = [...filteredHotels].sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
  } else if (sortOrder === 'rating_desc') {
    filteredHotels = [...filteredHotels].sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
  }

  const handleStarToggle = (star) => {
    setSelectedStars(prev => prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]);
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  if (isLoading) return <div className="text-white text-center py-20 text-2xl">Loading hotels...</div>;
  if (error) return <div className="text-red-500 text-center py-20 text-2xl">Error loading hotels! {error?.data?.message}</div>;

  const handleSearchClick = (e) => {
    e.preventDefault();
    setSearchQuery(destination);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 md:min-w-[300px] space-y-6">
        {/* Search Bar */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Destination</h2>
          <form onSubmit={handleSearchClick} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Maldives" 
              className="glass-input w-full px-4 py-2"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button type="submit" className="btn-primary px-4 py-2">Search</button>
          </form>
        </div>

        <div className="glass-panel p-6 rounded-2xl sticky top-28">
          <h2 className="text-xl font-bold text-white mb-6">Filter by:</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-hotel-gold mb-3 uppercase tracking-wider">Star Rating</h3>
            {[5, 4, 3, 2].map(star => (
              <label key={star} className="flex items-center mb-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedStars.includes(star)}
                  onChange={() => handleStarToggle(star)}
                  className="h-4 w-4 bg-black border-white/20 rounded focus:ring-hotel-gold text-hotel-gold mr-3" 
                />
                <span className="flex text-hotel-gold">
                  {[...Array(star)].map((_, i) => <FaStar key={i} />)}
                </span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-hotel-gold mb-3 uppercase tracking-wider">Popular Amenities</h3>
            {['Free Wifi', 'Swimming Pool', 'Spa & Wellness', 'Gym', 'Restaurant'].map(amenity => (
              <label key={amenity} className="flex items-center mb-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 bg-black border-white/20 rounded focus:ring-hotel-gold text-hotel-gold mr-3" 
                />
                <span className="text-gray-300 text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{filteredHotels.length} Properties found</h1>
            <p className="text-gray-400 text-sm">Showing top results for your criteria.</p>
          </div>
          <div>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#161925] border border-white/10 text-white text-sm rounded-lg focus:ring-hotel-gold focus:border-hotel-gold block w-full p-2.5"
            >
              <option value="none">Sort by: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
          </div>
        </div>

        {/* View Renderer */}
        <div className="space-y-6">
          {filteredHotels.length === 0 ? (
                 <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                   <h3 className="text-2xl text-white font-bold mb-2">Not Available</h3>
                   <p className="text-gray-400">Unfortunately, we do not have any properties matching "{searchQuery}" at this destination.</p>
                   <button onClick={() => { setSearchQuery(''); setDestination(''); }} className="mt-6 text-hotel-gold hover:text-white transition-colors">Clear all filters</button>
                 </div>
               ) : (
                 filteredHotels.map((hotel, idx) => (
                   <motion.div 
                     key={hotel._id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: idx * 0.1 }}
                     className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row gap-6 hover:border-hotel-gold/50 transition-colors"
                   >
                     <div className="relative w-full sm:w-64 h-48">
                       <img src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'} alt={hotel.name} className="w-full h-full object-cover rounded-xl" />
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleToggleWishlist(hotel._id); }}
                         className="absolute top-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
                       >
                         {userInfo?.wishlist?.some(w => (typeof w === 'object' ? w._id === hotel._id : w === hotel._id)) ? (
                           <FaHeart className="text-red-500 text-lg" />
                         ) : (
                           <FaRegHeart className="text-white text-lg" />
                         )}
                       </button>
                     </div>
                     
                     <div className="flex-1 flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start">
                           <div>
                             <h3 className="text-xl font-bold text-white hover:text-hotel-gold cursor-pointer transition-colors" onClick={() => navigate(`/hotel/${hotel._id}`)}>{hotel.name}</h3>
                             <p className="text-gray-400 text-sm flex items-center mt-1"><FaMapMarkerAlt className="mr-1 text-hotel-gold"/> {hotel.location}</p>
                           </div>
                           <div className="flex bg-[#161925] px-2 py-1 rounded text-xs items-center border border-white/10">
                             <span className="font-bold text-white mr-1">{hotel.starRating || 0}.0</span> <FaStar className="text-hotel-gold" />
                           </div>
                         </div>
                         
                         {hotel.description && (
                           <p className="text-gray-400 text-sm mt-3 line-clamp-2"><span className="text-gray-200 font-semibold mr-1">Description:</span>{hotel.description}</p>
                         )}

                         <div className="flex flex-wrap gap-2 mt-4 text-xs text-gray-300 items-center">
                           <span className="text-gray-200 font-semibold mr-1 text-sm">Amenities:</span>
                           {hotel.amenities?.map((amenity, i) => (
                              <span key={`${amenity}-${i}`} className="bg-white/5 px-2 py-1 rounded">{amenity}</span>
                           ))}
                         </div>
                       </div>
         
                       <div className="flex justify-between items-end border-t border-white/10 mt-4 pt-4">
                         <p className="text-xs text-green-400">✓ Free Cancellation</p>
                         <div className="text-right">
                           <p className="text-2xl font-bold text-white"><span className="text-sm text-gray-400 font-normal mr-1">Price:</span>₹{Number(hotel.pricePerNight).toLocaleString('en-IN')}</p>
                           <p className="text-xs text-gray-500 mb-2">per night</p>
                           <button onClick={() => navigate(`/hotel/${hotel._id}`)} className="bg-white hover:bg-gray-200 text-hotel-dark font-bold py-1.5 px-6 rounded-lg transition-colors text-sm">See Availability</button>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchHotels;
