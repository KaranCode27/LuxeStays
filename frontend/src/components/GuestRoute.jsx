import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If already logged in, send them to their respectful dashboard immediately preventing access to login/register!
  if (userInfo) {
    return <Navigate to={userInfo.role === 'admin' ? '/admin/dashboard' : '/user/profile'} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
