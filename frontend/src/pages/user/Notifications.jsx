import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation
} from '../../slices/notificationsApiSlice';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { data: response, isLoading } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifs = response?.data || [];

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const handleMarkSingle = async (id, isRead) => {
    if (isRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (title) => {
    const text = (title || '').toLowerCase();
    if (text.includes('confirm') || text.includes('success')) {
      return <div className="p-3 bg-green-500/20 text-green-400 rounded-full"><FaCheck /></div>;
    }
    if (text.includes('cancel') || text.includes('fail') || text.includes('error')) {
      return <div className="p-3 bg-red-500/20 text-red-400 rounded-full"><FaExclamationTriangle /></div>;
    }
    return <div className="p-3 bg-hotel-gold/20 text-hotel-gold rounded-full"><FaBell /></div>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400">
        <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
        <p>Loading your notifications...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">Stay updated on your account and upcoming trips.</p>
        </div>
        {notifs.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAll}
            className="text-hotel-gold text-sm font-medium hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        {notifs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FaBell className="text-4xl text-white/20 mx-auto mb-4" />
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifs.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleMarkSingle(item._id, item.isRead)}
                className={`p-6 flex gap-6 hover:bg-white/5 transition-colors cursor-pointer ${!item.isRead ? 'bg-hotel-gold/5' : ''}`}
              >
                <div className="flex-shrink-0">
                  {getIcon(item.title)}
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-lg font-bold ${!item.isRead ? 'text-white' : 'text-gray-300'}`}>{item.title}</h3>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-sm ${!item.isRead ? 'text-gray-300' : 'text-gray-500'}`}>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
