import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/Auth.jsx';
import AuthTableProvider from '../src/context/AuthTable';
import AppProvider from './components/Context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <AuthTableProvider>
    <AppProvider>
        <App />
    </AppProvider>
    </AuthTableProvider>
    </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>,
)
