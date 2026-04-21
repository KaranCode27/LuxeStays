import React from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaEnvelope } from 'react-icons/fa';

const UserInvoice = () => {
  const invoices = [
    { id: 'REC-2026-902', hotel: 'Oceanview Superior Resort', date: 'Oct 15, 2026', amount: '₹2,805.00', status: 'Paid' },
    { id: 'REC-2025-144', hotel: 'Grand Plaza Hotel', date: 'Dec 05, 2025', amount: '₹420.00', status: 'Paid' }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">My Invoices</h1>
        <p className="text-gray-400 mt-2">Manage your past booking receipts and financial records.</p>
      </motion.div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161925] text-gray-400 border-b border-white/10 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5 font-semibold">Receipt #</th>
                <th className="p-5 font-semibold">Property</th>
                <th className="p-5 font-semibold">Booking Date</th>
                <th className="p-5 font-semibold">Total Amount</th>
                <th className="p-5 font-semibold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-mono text-hotel-gold">{inv.id}</td>
                  <td className="p-5 font-medium text-white">{inv.hotel}</td>
                  <td className="p-5 text-gray-400">{inv.date}</td>
                  <td className="p-5 text-white font-bold">{inv.amount}</td>
                  <td className="p-5 text-right flex justify-end gap-3">
                    <button className="bg-hotel-gold/10 text-hotel-gold hover:bg-hotel-gold hover:text-black transition-colors px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                      <FaEnvelope /> Email File
                    </button>
                    <button className="bg-white/10 text-white hover:bg-white hover:text-black transition-colors px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                      <FaFilePdf /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p>You have no past invoices yet. Time to book your first getaway!</p>
        </div>
      )}
    </div>
  );
};

export default UserInvoice;
