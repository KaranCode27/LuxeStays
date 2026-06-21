import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';
import { useCreateBookingMutation } from '../slices/bookingsApiSlice';
import { useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '../slices/paymentsApiSlice';

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [status, setStatus] = useState('processing');
  
  const [createBooking] = useCreateBookingMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  const paymentInitiated = React.useRef(false);

  const handleRazorpayPayment = async () => {
    if (paymentInitiated.current) return;
    paymentInitiated.current = true;

    if (!state?.bookingPayload) {
      setStatus('error');
      return;
    }

    try {
      // 1. Create the booking in DB
      const bookingRes = await createBooking(state.bookingPayload).unwrap();
      const bookingId = bookingRes.data._id;

      // 2. Create Razorpay order
      const orderRes = await createRazorpayOrder({ bookingId }).unwrap();
      const order = orderRes.data;

      // 3. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_replace_me',
        amount: order.amount,
        currency: order.currency,
        name: 'LuxeStays Hotel',
        description: 'Hotel Booking Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            setStatus('verifying');
            // 4. Verify Payment on Backend
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }).unwrap();
            
            setStatus('success');
          } catch (err) {
            console.error('Payment verification failed:', err);
            setStatus('error');
          }
        },
        prefill: {
          name: state.bookingPayload.guestName || 'Guest User',
        },
        theme: {
          color: '#3395FF',
        },
      };

      // 5. Open Razorpay Checkout modal
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setStatus('error');
      });
      rzp1.open();

    } catch (err) {
      console.error('Booking/Payment flow failed:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'processing') {
      handleRazorpayPayment();
    }
    // Cleanup body overflow just in case Razorpay leaves it hidden
    if (status === 'success' || status === 'error') {
      document.body.style.overflow = 'unset';
    }
  }, [status]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 rounded-2xl max-w-md w-full text-center border border-hotel-gold/30 shadow-2xl shadow-hotel-gold/10"
        >
          {status === 'processing' ? (
            <div className="flex flex-col items-center py-8">
              <FaSpinner className="animate-spin text-5xl text-[#3395FF] mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Connecting to Razorpay...</h2>
              <p className="text-gray-400">Authenticating secure transaction. Please do not refresh.</p>
            </div>
          ) : status === 'verifying' ? (
             <div className="flex flex-col items-center py-8">
              <FaSpinner className="animate-spin text-5xl text-[#3395FF] mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment...</h2>
              <p className="text-gray-400">Please wait while we confirm your payment.</p>
            </div>
          ) : status === 'error' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <FaTimesCircle className="text-5xl text-red-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Payment Failed</h2>
              <p className="text-gray-400 mb-8">There was an issue processing your booking. Please try again.</p>
              
              <div className="w-full space-y-3">
                <button onClick={() => navigate(-1)} className="btn-primary w-full py-3">Go Back</button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-5xl text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-400 mb-8">Your reservation has been confirmed and the invoice has been sent to your email.</p>
              
              <div className="w-full space-y-3">
                <button onClick={() => navigate('/user/bookings')} className="btn-primary w-full py-3">View Bookings</button>
                <button onClick={() => navigate('/search')} className="text-hotel-gold hover:text-white transition-colors text-sm font-medium">Continue Browsing</button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
  );
};

export default Payment;
