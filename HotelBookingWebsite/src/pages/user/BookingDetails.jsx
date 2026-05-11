import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useGetBookingDetailsQuery, useCancelBookingMutation } from '../../slices/bookingsApiSlice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const BookingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: bookingResponse, isLoading, error, refetch } = useGetBookingDetailsQuery(id);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const booking = bookingResponse?.data;

  // Format dates beautifully
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCancelReservation = async () => {
    if (window.confirm("Are you absolutely sure you want to cancel this reservation? This cannot be undone.")) {
      try {
        await cancelBooking(id).unwrap();
        alert("Booking cancelled successfully.");
        refetch();
      } catch (err) {
        alert("Failed to cancel booking: " + (err?.data?.message || err.error));
      }
    }
  };

  const downloadPDFInvoice = () => {
    if (!booking) return;
    try {
      const doc = new jsPDF();
      const bookingObj = booking;
      
      const name = bookingObj.guestName || (bookingObj.userRef && bookingObj.userRef.name) || 'Guest';
      const amount = `Rs. ${bookingObj.totalPrice ? bookingObj.totalPrice.toLocaleString() : 0}`;
      const date = bookingObj.createdAt ? new Date(bookingObj.createdAt).toLocaleDateString() : 'N/A';
      const rawId = bookingObj._id ? String(bookingObj._id) : 'UNKNOWN';
      const transactionId = rawId.substring(0,8).toUpperCase();
      const status = bookingObj.status ? bookingObj.status.toUpperCase() : 'PENDING';
      const property = (bookingObj.hotelRef && bookingObj.hotelRef.name) || 'LuxeStays Property';
      
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
      if (bookingObj.checkInDate) {
         doc.text(`Check-In: ${new Date(bookingObj.checkInDate).toLocaleDateString()}`, 120, 76);
         doc.text(`Check-Out: ${new Date(bookingObj.checkOutDate).toLocaleDateString()}`, 120, 84);
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
      toast.success("Beautiful PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Generate Error: ", error);
      toast.error("Failed to generate PDF: " + error.message);
    }
  };

  if (isLoading) return <div className="text-white p-20 text-center"><FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-hotel-gold"/> Loading Booking Details...</div>;
  if (!booking) return <div className="text-red-500 p-20 text-center">Failed to load booking details correctly!</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate('/user/bookings')} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm">
        <FaArrowLeft className="mr-2" /> Back to All Bookings
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider text-hotel-gold mb-1">
             {booking.status === 'Cancelled' ? 'Booking Cancelled' : 'Booking Confirmed'}
          </h1>
          <p className="text-gray-400">Confirmation Number: <span className="text-white font-mono">{booking._id}</span></p>
        </div>
        <button onClick={downloadPDFInvoice} className="bg-white/10 hover:bg-white border border-white/20 hover:text-black transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <FaDownload className="mr-2"/> Receipt PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Stay Summary</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <img src={booking.hotelRef?.images?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'} className="w-full md:w-48 h-32 object-cover rounded-xl" alt="Hotel"/>
              <div>
                <h3 className="text-2xl font-bold text-white">{booking.hotelRef?.name}</h3>
                <p className="text-sm text-hotel-gold mt-1 mb-2">{booking.roomRef?.type || 'Standard Room'}</p>
                <p className="text-sm text-gray-400 flex items-center"><FaMapMarkerAlt className="mr-1"/> {booking.hotelRef?.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-[#161925] p-6 rounded-xl border border-white/5">
               <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Check-in</p>
                  <p className="text-white font-medium text-lg">{formatDate(booking.checkInDate)}</p>
                  <p className="text-xs text-gray-400">After 3:00 PM</p>
               </div>
               <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Check-out</p>
                  <p className="text-white font-medium text-lg">{formatDate(booking.checkOutDate)}</p>
                  <p className="text-xs text-gray-400">Before 11:00 AM</p>
               </div>
               <div className="col-span-2 border-t border-white/10 pt-4 mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Primary Guest</p>
                    <p className="text-white font-medium">{booking.userRef?.name || 'Valued Guest'}</p>
                    <p className="text-xs text-gray-400">{booking.guestCount || 2} Guests • 1 Room</p>
                  </div>
                  <div>
                    {booking.status !== 'Cancelled' && (
                       <button onClick={handleCancelReservation} disabled={isCancelling} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-6 py-2 rounded-lg font-bold transition-colors text-sm">
                          {isCancelling ? 'Cancelling...' : 'Cancel Reservation'}
                       </button>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl bg-[#0a0d14]">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-4">Payment Breakdown</h3>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                 <span className="text-gray-400">₹850 x 3 nights</span>
                 <span className="text-white">₹2,550.00</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-400">Taxes & Resort Fees</span>
                 <span className="text-white">₹255.00</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-gray-400">VIP Discount applied</span>
                 <span className="text-green-400">-₹0.00</span>
              </div>
              
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                 <span className="text-white font-bold text-lg">Total Paid</span>
                 <span className="text-hotel-gold font-bold text-2xl">₹{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            {booking.status === 'Cancelled' ? (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start">
                 <FaTimesCircle className="text-red-400 mt-0.5 mr-3" />
                 <div>
                   <p className="text-sm font-medium text-red-400">Reservation Cancelled</p>
                   <p className="text-xs text-gray-400 mt-1">This booking is no longer active.</p>
                 </div>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-start">
                 <FaCheckCircle className="text-green-400 mt-0.5 mr-3" />
                 <div>
                   <p className="text-sm font-medium text-green-400">Payment Successful</p>
                   <p className="text-xs text-gray-400 mt-1">Confirmed booking.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetails;
