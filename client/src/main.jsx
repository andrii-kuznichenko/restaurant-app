import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/Auth.jsx";
import AuthTableProvider from "../src/context/AuthTable";
import { NotificationProvider } from "./context/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>

  <BrowserRouter>
    <AuthProvider>
      <AuthTableProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthTableProvider>
    </AuthProvider>
  </BrowserRouter>

  // </React.StrictMode>,
);
