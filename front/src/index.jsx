import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminApp from './admin/AdminApp';
import './styles/global.css';

const adminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')).render(adminRoute ? <AdminApp /> : <App />);
