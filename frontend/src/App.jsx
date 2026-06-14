import { Routes, Route, Navigate } from 'react-router-dom';

/* Public Bare Routes */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

/* Route Protections */
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';

/* Public Layout & Pages */
import PublicLayout from './layouts/PublicLayout';
import SearchHotels from './pages/SearchHotels';
import HotelDetails from './pages/HotelDetails';
import RoomDetails from './pages/RoomDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Offers from './pages/Offers';

/* User Dashboard */
import UserLayout from './layouts/UserLayout';
import UserProfile from './pages/user/UserProfile';
import MyBookings from './pages/user/MyBookings';
import BookingDetails from './pages/user/BookingDetails';
import Wishlist from './pages/user/Wishlist';
import UserFeedback from './pages/user/UserFeedback';
import Notifications from './pages/user/Notifications';

/* Admin Layer */
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageHotels from './pages/admin/ManageHotels';
import AddHotel from './pages/admin/AddHotel';
import EditHotel from './pages/admin/EditHotel';
import ManageRooms from './pages/admin/ManageRooms';
import ManageBookings from './pages/admin/ManageBookings';
import Invoice from './pages/admin/Invoice';
import Feedback from './pages/admin/Feedback';
import UserManagement from './pages/admin/UserManagement';
import ContactMessages from './pages/admin/ContactMessages';

function App() {
  return (
    <div className="min-h-screen bg-hotel-dark text-white font-sans">
      <Routes>
        {/* Auth & Standalone Routes - Guarded against logged-in users */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/" element={<Home />} />

        {/* Standard Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="search" element={<SearchHotels />} />
          <Route path="offers" element={<Offers />} />
          <Route path="hotel/:id" element={<HotelDetails />} />
          <Route path="room/:roomId" element={<RoomDetails />} />
          <Route path="book/:id" element={<Booking />} />
          <Route path="payment" element={<Payment />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          
          
          {/* Secured User Dashboard Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="user" element={<UserLayout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="reviews" element={<UserFeedback />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            {/* Kept invoice for legacy compat if needed, but it's redundant with bookings now */}
          </Route>
        </Route>

        {/* Admin Secured Routes */}
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="hotels" element={<ManageHotels />} />
            <Route path="hotels/add" element={<AddHotel />} />
            <Route path="hotels/edit/:id" element={<EditHotel />} />
            
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="invoice" element={<Invoice />} />
            <Route path="feedback" element={<Feedback />} />
            
            <Route path="users" element={<UserManagement />} />
            <Route path="messages" element={<ContactMessages />} />
          </Route>
        </Route>

        {/* Extra Marks: Beautiful 404 Intercept */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;
