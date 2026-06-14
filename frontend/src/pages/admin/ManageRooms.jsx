import React from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { useGetRoomsQuery, useDeleteRoomMutation } from '../../slices/roomsApiSlice';
import toast from 'react-hot-toast';

const ManageRooms = () => {
  const { data: roomsResponse, isLoading, refetch } = useGetRoomsQuery();
  const rooms = roomsResponse?.data || [];
  
  const [deleteRoom] = useDeleteRoomMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(id).unwrap();
        toast.success('Room deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete room');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Room Inventory</h1>
          <p className="text-gray-400 mt-1">Control room types, pricing, and availability quotas.</p>
        </div>
        <button className="btn-primary">
          <FaPlus /> Add Room Type
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
           <select className="glass-input !py-1.5 text-sm bg-transparent w-64 border border-white/20">
              <option>Filter by Hotel: All</option>
              <option>Taj Lake Palace</option>
              <option>The Leela Kovalam</option>
           </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
            <p>Loading rooms...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161925] text-gray-400 border-b border-white/10 uppercase tracking-widest text-xs">
              <tr>
                <th className="p-4 font-semibold">Room Code</th>
                <th className="p-4 font-semibold">Associated Hotel</th>
                <th className="p-4 font-semibold">Room Type</th>
                <th className="p-4 font-semibold">Max Cap</th>
                <th className="p-4 font-semibold">Base Price</th>
                <th className="p-4 font-semibold">Total Stock</th>
                <th className="p-4 font-semibold text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-hotel-gold text-xs">{room.roomNumber}</td>
                  <td className="p-4 text-gray-400">{room.hotel?.name || 'Unknown Hotel'}</td>
                  <td className="p-4 font-medium text-white">{room.type}</td>
                  <td className="p-4 text-gray-400">{room.capacity} Pax</td>
                  <td className="p-4 text-white font-medium">₹{room.price?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-white">{room.inventory || 1} Rooms</span>
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-3">
                    <button className="text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                      <FaEdit className="text-lg" />
                    </button>
                    <button onClick={() => handleDelete(room._id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
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

export default ManageRooms;
