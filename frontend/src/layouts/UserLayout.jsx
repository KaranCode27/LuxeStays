import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUser, FaSuitcase, FaHeart, FaStar, FaBell, FaSignOutAlt } from 'react-icons/fa';

const UserLayout = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const menu = [
    { name: 'My Profile', path: '/user/profile', icon: FaUser },
    { name: 'My Bookings', path: '/user/bookings', icon: FaSuitcase },
    { name: 'Wishlist', path: '/user/wishlist', icon: FaHeart },
    { name: 'My Reviews', path: '/user/reviews', icon: FaStar },
    { name: 'Notifications', path: '/user/notifications', icon: FaBell },
  ];

  return (
    <div className="min-h-screen bg-hotel-dark font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-hotel-gold rounded-full flex items-center justify-center text-black font-bold text-xl uppercase">
                {userInfo?.name ? userInfo.name.substring(0, 2) : 'JD'}
              </div>
              <div>
                <p className="text-white font-bold">{userInfo?.name || 'Loading...'}</p>
                <p className="text-xs text-hotel-gold">LuxeCircle Member</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menu.map((item) => (
                <NavLink 
                  key={item.name} 
                  to={item.path}
                   className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-hotel-gold/10 text-hotel-gold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                   }`}
                >
                  <item.icon /> {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-white/10 mt-6 pt-6">
               <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full"
               >
                 <FaSignOutAlt /> Log Out
               </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default UserLayout;
