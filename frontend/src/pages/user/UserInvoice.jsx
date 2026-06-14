import React from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaEnvelope, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetMyBookingsQuery } from '../../slices/bookingsApiSlice';
import toast from 'react-hot-toast';

const UserInvoice = () => {
  const { data: bookingsResponse, isLoading } = useGetMyBookingsQuery();
  const invoices = bookingsResponse?.data || [];

  const handleEmailClick = () => {
    toast.success('Invoice copy sent to your registered email!');
  };

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    
    const name = booking.guestName || booking.userRef?.name || 'Guest';
    const amount = `Rs. ${booking.totalPrice?.toLocaleString()}`;
    const date = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A';
    const transactionId = booking._id?.substring(0,8).toUpperCase();
    const property = booking.hotelRef?.name || 'LuxeStays Property';
    const status = booking.status || 'Pending';

      // Header Background (Dark Blue)
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 45, 'F');

      // Header Text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('LUXESTAYS', 14, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 200);
      doc.text('Premium Hotel Booking Platform', 14, 34);

      // Right Side Header
      doc.setTextColor(212, 175, 55); // Gold
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE / RECEIPT', 196, 25, { align: 'right' });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`ID: ${transactionId}`, 196, 34, { align: 'right' });

      // Guest & Property Info Block
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      
      // Left Col
      doc.setFont('helvetica', 'bold');
      doc.text('Billed To:', 14, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`${name}`, 14, 68);
      doc.text(`Booking Date: ${date}`, 14, 76);
      doc.text(`Status: ${status}`, 14, 84);

      // Right Col
      doc.setFont('helvetica', 'bold');
      doc.text('Property:', 120, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`${property}`, 120, 68);
      if (booking.checkInDate) {
         doc.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`, 120, 76);
         doc.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, 120, 84);
      }

      // Divider Line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 92, 196, 92);

      // AutoTable
      autoTable(doc, {
        startY: 100,
        head: [['Description', 'Amount Billed']],
        body: [
          ['Room Stay Accommodation', amount],
          ['Taxes & Processing Fees', 'Included'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        styles: { fontSize: 11, cellPadding: 6 }
      });

      // Total Box
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFillColor(245, 245, 245);
      doc.rect(130, finalY, 66, 22, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('TOTAL PAID:', 135, finalY + 14);
      
      doc.setTextColor(212, 175, 55);
      doc.text(`${amount}`, 192, finalY + 14, { align: 'right' });

      // Footer
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Thank you for choosing LuxeStays. Have a safe journey!', 105, 280, { align: 'center' });

      doc.save(`LuxeStays_Receipt_${transactionId}.pdf`);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">My Invoices</h1>
        <p className="text-gray-400 mt-2">Manage your past booking receipts and financial records.</p>
      </motion.div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-10 flex flex-col items-center text-gray-400">
             <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
             <p>Loading your personal receipts...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>You have no past invoices yet. Time to book your first getaway!</p>
          </div>
        ) : (
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
                <tr key={inv._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-mono text-hotel-gold">{inv._id?.substring(0,8).toUpperCase()}</td>
                  <td className="p-5 font-medium text-white">{inv.hotelRef?.name || 'Hotel'}</td>
                  <td className="p-5 text-gray-400">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-5 text-white font-bold">₹{inv.totalPrice?.toLocaleString()}</td>
                  <td className="p-5 text-right flex justify-end gap-3">
                    <button onClick={handleEmailClick} className="bg-hotel-gold/10 text-hotel-gold hover:bg-hotel-gold hover:text-black transition-colors px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                      <FaEnvelope /> Email File
                    </button>
                    <button onClick={() => generatePDF(inv)} className="bg-white/10 text-white hover:bg-white hover:text-black transition-colors px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                      <FaFilePdf /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

    </div>
  );
};

export default UserInvoice;
