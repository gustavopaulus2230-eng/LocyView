import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import MobilePreview from './components/MobilePreview';
import './styles/global.css';

const mobilePreview = new URLSearchParams(window.location.search).get('preview') === 'mobile';

createRoot(document.getElementById('root')).render(mobilePreview ? <MobilePreview /> : <App />);
