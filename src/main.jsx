import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AuthGate from './AuthGate.jsx';
import './style.css';
import './map-ux.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><AuthGate>{auth => <App key={auth.session?.user?.id || 'solo'} {...auth} />}</AuthGate></React.StrictMode>
);