import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const Private = ({ Component }: any) => {
  const authToken = useAuthStore.getState().authToken;
  const auth = authToken.length > 0;

  return auth ? <Component /> : <Navigate to="/auth/login" />;
};

export default Private;
