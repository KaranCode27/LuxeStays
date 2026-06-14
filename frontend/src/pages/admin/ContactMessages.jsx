import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaTrash, FaEnvelopeOpenText } from 'react-icons/fa';

const ContactMessages = () => {
  const [expandedId, setExpandedId] = useState(null);

  const messages = [
    { id: 1, name: 'Aarav Patel', email: 'aarav.patel@gmail.com', subject: 'Corporate Partnership Inquiry', date: 'Today, 2:30 PM', msg: 'Hello LuxeStays team. I represent a leading corporate travel agency in London and we would love to discuss a B2B integration with your platform to offer your exclusive catalog to our VIP clients. Please let me know your availability for a call next week.', read: false },
    { id: 2, name: 'Sara Jenkins', email: 'sara.j@mail.com', subject: 'Booking Modification Request', date: 'Yesterday', msg: 'Hi, I booked the Superior Villa at the Oceanview resort for next month but I need to push my dates back by exactly two days due to a flight change. Can you verify if those new dates are available?', read: true },
    { id: 3, name: 'Emily Clark', email: 'e.clark89@gmail.com', subject: 'General Question', date: 'Oct 02, 2026', msg: 'Do you allow small pets at the Alpine Lodge in Switzerland?', read: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Inbox</h1>
          <p className="text-gray-400 mt-1">Review and respond to messages submitted via the Contact form.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="p-4 bg-black/40 border-b border-white/10 flex justify-between text-sm text-gray-400 font-medium px-8 uppercase tracking-widest text-xs">
           <div className="w-1/4">Sender info</div>
           <div className="w-2/4">Subject</div>
           <div className="w-1/4 text-right">Received</div>
        </div>

        <div className="divide-y divide-white/5 bg-[#0B0E14]">
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col">
              {/* Row Header */}
              <div 
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} 
                className={`flex gap-4 p-5 items-center cursor-pointer hover:bg-white/5 transition-colors ${!m.read ? 'bg-hotel-gold/5 border-l-4 border-hotel-gold' : 'border-l-4 border-transparent'}`}
              >
                 <div className="w-1/4 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hotel-gold to-hotel-accent flex items-center justify-center text-black font-bold">
                     {m.name.charAt(0)}
                   </div>
                   <div>
                     <p className={`text-sm ${!m.read ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>{m.name}</p>
                     <p className="text-xs text-gray-500 truncate">{m.email}</p>
                   </div>
                 </div>
                 
                 <div className="w-2/4">
                   <p className={`text-sm truncate pr-4 ${!m.read ? 'text-white font-medium' : 'text-gray-400'}`}>{m.subject}</p>
                 </div>

                 <div className="w-1/4 text-right">
                   <p className="text-xs text-gray-500">{m.date}</p>
                 </div>
              </div>

              {/* Expanded Data Block */}
              <AnimatePresence>
                {expandedId === m.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-black/20 overflow-hidden">
                     <div className="p-8 border-t border-white/5 mx-5 my-2">
                        <div className="flex items-center text-hotel-gold mb-4 text-sm font-semibold">
                           <FaEnvelopeOpenText className="mr-2" /> Message Content
                        </div>
                        <p className="text-gray-300 leading-relaxed bg-[#161925] p-6 rounded-xl border border-white/5 mb-6 text-sm">
                          "{m.msg}"
                        </p>
                        <div className="flex gap-4">
                           <button className="btn-primary flex items-center gap-2 py-2 px-6 text-sm"><FaReply /> Reply to User</button>
                           <button className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                             <FaTrash /> Delete Thread
                           </button>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ContactMessages;
