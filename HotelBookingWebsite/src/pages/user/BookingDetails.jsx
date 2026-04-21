import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useGetBookingDetailsQuery, useCancelBookingMutation } from '../../slices/bookingsApiSlice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    const doc = new jsPDF();

    // Standard Setup
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LuxeStays Official Receipt", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Confirmation Number: ${booking._id}`, 20, 40);
    doc.text(`Booking Status: ${booking.status || 'Active'}`, 20, 50);

    // Guest Info
    doc.text(`Guest: ${booking.userRef?.name || 'Valued Guest'}`, 20, 70);
    doc.text(`Property: ${booking.hotelRef?.name}`, 20, 80);
    
    // AutoTable generating standard grid layout
    const tableData = [
      ["Check-In", formatDate(booking.checkInDate)],
      ["Check-Out", formatDate(booking.checkOutDate)],
      ["Guests", String(booking.guestCount || 2)],
      ["Room Configuration", booking.roomRef?.type || 'Standard Suite']
    ];

    doc.autoTable({
      startY: 95,
      head: [['Description', 'Details']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });

    const finalY = doc.lastAutoTable.finalY || 140;

    // Financials
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: INR ${booking.totalPrice?.toLocaleString()}`, 130, finalY + 20);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for choosing LuxeStays. Have a safe journey!", 105, 270, { align: "center" });

    doc.save(`LuxeStays_Invoice_${booking._id}.pdf`);
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
