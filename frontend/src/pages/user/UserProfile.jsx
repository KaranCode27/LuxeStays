import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserProfileMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  // Split name for UI (if user only has 1 name, handled gracefully)
  const names = userInfo?.name ? userInfo.name.split(' ') : [''];
  const [firstName, setFirstName] = useState(names[0] || '');
  const [lastName, setLastName] = useState(names.slice(1).join(' ') || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
      }).unwrap();
      
      dispatch(setCredentials({ ...res.data }));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Update failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your personal information and preferences.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isEditing ? 'bg-gray-600 text-white' : 'bg-hotel-gold text-black hover:bg-hotel-accent'}`}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="glass-input w-full" disabled={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="glass-input w-full" disabled={!isEditing} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="glass-input w-full" disabled={!isEditing} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="glass-input w-full" disabled={!isEditing} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Currency</label>
            <select className="glass-input w-full bg-[#161925]" disabled={!isEditing}>
              <option>INR (₹)</option>
            </select>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-white/10 mt-6 flex justify-end">
              <button type="submit" disabled={isLoading} className="btn-primary px-8 flex items-center">
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null} Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="glass-panel p-8 rounded-2xl mt-8 border border-red-500/20">
        <h3 className="text-xl font-bold text-white mb-2 text-red-500">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-6">Permanently delete your account and remove all associated data.</p>
        <button className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors text-sm">
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default UserProfile;
