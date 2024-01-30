import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import AuthTableProvider from '../src/context/AuthTable';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthTableProvider>
        <App />
    </AuthTableProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
