import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCreateHotelMutation } from '../../slices/hotelsApiSlice';

const AddHotel = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [starRating, setStarRating] = useState('5');
  const [pricePerNight, setPricePerNight] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  const [createHotel, { isLoading }] = useCreateHotelMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         setMessage("File size is too large. Please select an image under 5MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const hotelData = {
        name,
        location,
        description,
        starRating: Number(starRating),
        pricePerNight: Number(pricePerNight),
      };
      if (image) {
        hotelData.images = [image];
      }

      await createHotel(hotelData).unwrap();
      navigate('/admin/hotels');
    } catch (err) {
      setMessage(err?.data?.message || err.error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate('/admin/hotels')} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <FaArrowLeft className="mr-2" /> Back to Hotel List
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Add New Property</h1>
        <p className="text-gray-400 mt-1">Publish a new hotel to the LuxeStays ecosystem.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        {message && <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded mb-6">{message}</div>}
        <form onSubmit={submitHandler} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Hotel Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="glass-input w-full" placeholder="Ex: The Grand Reserve" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location/City</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="glass-input w-full" placeholder="Ex: Paris, France" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hotel Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="glass-input w-full resize-none" placeholder="Provide a luxurious description..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Star Rating</label>
              <select value={starRating} onChange={(e) => setStarRating(e.target.value)} className="glass-input w-full bg-[#161925]">
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Base Nightly Price (₹)</label>
              <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required className="glass-input w-full" placeholder="Ex: 500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Hero Image</label>
            <div className="w-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden relative group cursor-pointer h-48 bg-black/20 flex items-center justify-center">
               {image && <img src={image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />}
               <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity pointer-events-none ${image ? 'opacity-0 group-hover:opacity-100 bg-black/40' : 'opacity-100 text-gray-400'}`}>
                  <FaUpload className={`text-3xl mb-2 ${image ? 'text-white' : 'text-gray-400'}`} />
                  <p className={`font-bold text-sm tracking-wide ${image ? 'text-white' : 'text-gray-400'}`}>{image ? 'Change Photo' : 'Click to Upload Photo'}</p>
               </div>
               <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex justify-end gap-4">
             <button type="button" onClick={() => navigate('/admin/hotels')} className="px-6 py-2 rounded-lg text-white font-medium hover:bg-white/5 transition-colors border border-white/20">Cancel</button>
             <button type="submit" disabled={isLoading} className="btn-primary px-8">
               {isLoading ? 'Publishing...' : 'Publish Hotel'}
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddHotel;
