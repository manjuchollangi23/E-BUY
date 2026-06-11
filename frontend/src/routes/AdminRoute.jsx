import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const AdminRoute = ({ children }) => {
  const { userInfo } = useContext(ShopContext);

  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
