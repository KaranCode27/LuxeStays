import React from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaUserTimes, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useGetUsersQuery } from '../../slices/usersApiSlice';

const UserManagement = () => {
  const { data: usersResponse, isLoading } = useGetUsersQuery();
  const users = usersResponse?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-1">Audit platform accounts and control access privileges.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border border-white/5">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
            <p>Loading users...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161925] text-gray-400 border-b border-white/10 uppercase tracking-widest text-xs">
              <tr>
                <th className="p-4 font-semibold">User ID</th>
                <th className="p-4 font-semibold">Full Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Tier Context</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-500 text-xs">{user._id?.substring(0,8).toUpperCase()}</td>
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-hotel-gold text-xs">{user.email}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs rounded border border-hotel-gold text-hotel-gold bg-hotel-gold/10`}>
                        {user.role || 'user'}
                     </span>
                  </td>
                  <td className="p-4 text-gray-400">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400`}>
                      Active
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end space-x-3">
                    <button className="text-gray-400 hover:text-white transition-colors" title="Email User">
                      <FaEnvelope className="text-lg" />
                    </button>
                    <button className="text-gray-400 hover:text-hotel-gold transition-colors" title="Make Admin">
                      <FaUserShield className="text-lg" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors" title="Ban User">
                      <FaUserTimes className="text-lg" />
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

export default UserManagement;
