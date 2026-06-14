import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutApiCallMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';
import toast from 'react-hot-toast';
import { FaChartPie, FaBuilding, FaBook, FaFileInvoiceDollar, FaCommentDots, FaSignOutAlt, FaCar } from 'react-icons/fa';
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutApiCallMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaChartPie },
    { name: 'Manage Hotels', path: '/admin/hotels', icon: FaBuilding },

    { name: 'Manage Bookings', path: '/admin/bookings', icon: FaBook },
    { name: 'Invoices', path: '/admin/invoice', icon: FaFileInvoiceDollar },
    { name: 'Feedback', path: '/admin/feedback', icon: FaCommentDots },
  ];

  return (
    <div className="w-64 bg-[#0A0D14] min-h-screen border-r border-white/10 flex flex-col justify-between hidden md:flex sticky top-0 h-screen overflow-y-auto">
      <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest"><span className="text-hotel-gold">Luxe</span>Admin</h1>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive ? 'bg-hotel-gold/10 text-hotel-gold border border-hotel-gold/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="text-lg mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
        >
          <FaSignOutAlt className="text-lg mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
