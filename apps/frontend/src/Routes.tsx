import React from 'react';
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import Private from './utils/PrivateRoute';
import { Settings } from './pages/Settings';
import { Register } from './pages/Register';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="auth/">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="settings" element={<Private Component={Settings} />}></Route>

      <Route path="" element={<Private Component={Dashboard} />}></Route>
    </RouterRoutes>
  );
};

export default Routes;
