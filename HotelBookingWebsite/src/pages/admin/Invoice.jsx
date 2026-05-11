import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFileInvoice, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetBookingsQuery } from '../../slices/bookingsApiSlice';
import toast from 'react-hot-toast';

const Invoice = () => {
  const { data: bookingsResponse, isLoading } = useGetBookingsQuery();
  const bookings = bookingsResponse?.data || [];

  const generatePDF = (booking) => {
    try {
      const doc = new jsPDF();
      
      // Strict string fallbacks to prevent undefined.toUpperCase crashes
      const name = booking.guestName || (booking.userRef && booking.userRef.name) || 'Guest';
      const amount = `Rs. ${booking.totalPrice ? booking.totalPrice.toLocaleString() : 0}`;
      const date = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A';
      const rawId = booking._id ? String(booking._id) : 'UNKNOWN';
      const transactionId = rawId.substring(0,8).toUpperCase();
      const status = booking.status || 'Pending';

      const property = (booking.hotelRef && booking.hotelRef.name) || 'LuxeStays Property';
      
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

      doc.save(`LuxeStays_Invoice_${transactionId}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Generate Error: ", error);
      toast.error("Failed to generate PDF: " + error.message);
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
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 mt-1">Manage billing, payments, and generated invoices.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex flex-col items-center text-gray-400">
             <FaSpinner className="animate-spin text-4xl text-hotel-gold mb-4" />
             <p>Generating dynamically loaded invoices...</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="pb-4 font-medium">Invoice #</th>
              <th className="pb-4 font-medium">Guest</th>
              <th className="pb-4 font-medium">Issue Date</th>
              <th className="pb-4 font-medium">Amount Due</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-mono text-hotel-gold text-xs flex items-center gap-2 mt-2">
                  <FaFileInvoice className="text-gray-500" /> {booking._id?.substring(0,8).toUpperCase()}
                </td>
                <td className="py-4 font-medium text-white">{booking.guestName || booking.userRef?.name || 'Guest'}</td>
                <td className="py-4 text-gray-400">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="py-4 text-white font-medium">₹{booking.totalPrice?.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${(booking.status || 'Pending').toLowerCase() === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {booking.status || 'Pending'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={() => generatePDF(booking)} className="text-hotel-gold hover:text-white transition-colors border border-hotel-gold/30 px-3 py-1 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer float-right mr-4">
                    <FaDownload /> PDF
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

export default Invoice;
