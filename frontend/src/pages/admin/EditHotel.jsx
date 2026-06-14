import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetHotelDetailsQuery, useUpdateHotelMutation } from '../../slices/hotelsApiSlice';
import toast from 'react-hot-toast';

const EditHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: hotelResponse, isLoading: isLoadingDetails } = useGetHotelDetailsQuery(id);
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [starRating, setStarRating] = useState('5');
  const [pricePerNight, setPricePerNight] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (hotelResponse?.data) {
      const h = hotelResponse.data;
      setName(h.name || '');
      setLocation(h.location || '');
      setDescription(h.description || '');
      setStarRating(h.starRating ? h.starRating.toString() : '5');
      setPricePerNight(h.pricePerNight || '');
    }
  }, [hotelResponse]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         toast.error("File size is too large. Please select an image under 5MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        hotelId: id,
        name,
        location,
        description,
        starRating: Number(starRating),
        pricePerNight: Number(pricePerNight),
      };
      if (image) {
        hotelData.images = [image];
      }

      await updateHotel(hotelData).unwrap();
      toast.success('Hotel updated successfully!');
      navigate('/admin/hotels');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Update failed');
    }
  };

  if (isLoadingDetails) {
     return <div className="p-20 text-center"><FaSpinner className="animate-spin text-hotel-gold text-4xl mx-auto" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate('/admin/hotels')} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <FaArrowLeft className="mr-2" /> Back to Hotel List
      </button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Property <span className="text-hotel-gold text-xl block sm:inline mt-1 sm:mt-0 sm:ml-2">#{id || '102'}</span></h1>
          <p className="text-gray-400 mt-1">Make modifications to your existing listings.</p>
        </div>
        <button className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg text-sm border border-red-500/30">
          Delete Listing
        </button>
      </div>

      <div className="glass-panel p-8 rounded-2xl border-t-4 border-hotel-gold">
        <form onSubmit={submitHandler} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hotel Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location/City</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="glass-input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hotel Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="glass-input w-full resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Star Rating</label>
              <select value={starRating} onChange={(e) => setStarRating(e.target.value)} required className="glass-input w-full bg-[#161925]">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Base Nightly Price (₹)</label>
              <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required className="glass-input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Hero Image</label>
            <div className="w-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden relative group cursor-pointer h-48 bg-black/20 flex items-center justify-center">
               <img src={image || hotelResponse?.data?.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000'} alt="Preview" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <FaUpload className="text-3xl text-white mb-2" />
                  <p className="text-white font-bold tracking-wide">Change Photo</p>
               </div>
               <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex justify-end gap-4">
             <button type="button" onClick={() => navigate('/admin/hotels')} className="px-6 py-2 rounded-lg text-white font-medium hover:bg-white/5 transition-colors border border-white/20">Discard Changes</button>
             <button type="submit" disabled={isUpdating} className="btn-primary px-8">
               {isUpdating ? 'Saving...' : 'Save Updates'}
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditHotel;
