import { createContext, useState, useEffect } from "react";
import axios from "../axiosInstance";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const setState = (admin, loading, errors) => {
    setAdmin(admin); 
    setLoading(loading);
    setErrors(errors);
  };

  useEffect(() => {
    axios
      .get("/admin/currentAdmin")
      .then((res) => {
        setState(res.data.admin, false, null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
        setState(null, false, error.response.data);
      });
  }, []);

  const register = (admin) => {
    axios
      .post("/admin/register", admin)
      .then((res) => {
        setState(res.data.admin, false, null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
        setState(null, false, error.response.data);
      });
  };

  const login = (admin) => {
    axios
      .post("/admin/login", admin)
      .then((res) => {
        setState(res.data.admin, false, null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
        setState(null, false, error.response.data);
      });
  };

  const logout = () => {
    axios
      .post("/admin/logout", {})
      .then((res) => {
        setState(null, false, null);
        navigate("/");
        window.location.reload()
      })
    //   .catch((error) => {
    //     console.log(error.response.data);
    //     setState(null, false, error.response.data);
    //   });
  };

  return (
    <AuthContext.Provider
      value={{ admin, loading, errors, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
