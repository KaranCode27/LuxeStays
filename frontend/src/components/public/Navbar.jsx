import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutApiCallMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';
import { FaBars, FaTimes, FaAngleDown, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutApiCallMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const links = [
    { name: 'Hotel', path: '/search' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms', path: '/terms' },
  ];

  return (
    <nav className="w-full bg-hotel-dark/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
              <span className="text-hotel-gold">Luxe</span>Stays
            </h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-hotel-gold border-b-2 border-hotel-gold' : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 items-center relative">
            {userInfo ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center gap-2 text-white hover:text-hotel-gold transition-colors font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10"
                >
                  <FaUserCircle className="text-xl" />
                  <span>{userInfo.name.split(' ')[0]}</span>
                  <FaAngleDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Desktop Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-hotel-card border border-white/10 divide-y divide-white/10">
                    <div className="py-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); navigate(userInfo.role === 'admin' ? '/admin/dashboard' : '/user/profile'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                      >
                        Dashboard
                      </button>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 font-medium"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Log In</button>
                <button onClick={() => navigate('/register')} className="bg-hotel-gold hover:bg-hotel-accent text-black text-sm font-bold py-2 px-5 rounded-lg transition-transform active:scale-95">Sign Up</button>
              </>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-hotel-card border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-hotel-gold/10 text-hotel-gold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              {userInfo ? (
                 <>
                   <button onClick={() => { setIsOpen(false); navigate(userInfo.role === 'admin' ? '/admin/dashboard' : '/user/profile'); }} className="w-full text-left px-3 py-2 text-hotel-gold hover:bg-white/5 font-medium">Dashboard</button>
                   <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 font-medium">Log Out</button>
                 </>
              ) : (
                <>
                  <button onClick={() => { setIsOpen(false); navigate('/login'); }} className="w-full text-left px-3 py-2 text-gray-300 hover:text-white font-medium">Log In</button>
                  <button onClick={() => { setIsOpen(false); navigate('/register'); }} className="w-full bg-hotel-gold text-black px-3 py-2 rounded-md font-bold text-center">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
