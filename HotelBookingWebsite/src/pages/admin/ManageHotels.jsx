import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { useGetHotelsQuery, useDeleteHotelMutation } from '../../slices/hotelsApiSlice';
import toast from 'react-hot-toast';

const ManageHotels = () => {
  const navigate = useNavigate();
  const { data: hotelsResponse, isLoading, refetch } = useGetHotelsQuery({ limit: 100 });
  const hotels = hotelsResponse?.data || [];
  
  const [deleteHotel] = useDeleteHotelMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotel(id).unwrap();
        toast.success('Hotel deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete hotel');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Hotels</h1>
          <p className="text-gray-400 mt-1">Control your property catalog and availability.</p>
        </div>
        <button onClick={() => navigate('/admin/hotels/add')} className="btn-primary">
          <FaPlus /> Add New Hotel
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
            <p>Loading catalog data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/30 text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">Hotel Name</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Total Rooms</th>
                <th className="p-4 font-medium">Base Price/Night</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{hotel.name}</td>
                  <td className="p-4 text-gray-400">{hotel.location}</td>
                  <td className="p-4 text-gray-400">Total rooms unavailable</td>
                  <td className="p-4 text-hotel-gold">₹{hotel.pricePerNight?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30`}>
                      Active
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-3">
                    <button onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)} className="text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                      <FaEdit className="text-lg" />
                    </button>
                    <button onClick={() => handleDelete(hotel._id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManageHotels;
