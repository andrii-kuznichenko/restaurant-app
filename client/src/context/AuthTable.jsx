import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';

export const AuthTableContext = createContext();

function AuthTableProvider({ children }) {
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const setState = (table, loading, errors) => {
    setTable(table);
    setLoading(loading);
    setErrors(errors);
  };
  useEffect(() => {
    axios
      .get('auth/currentTable')
      .then(res => {
        setState(res.data.table, false, null);
      })
      .catch(error => {
        // we don't care about this error so I'm not storing it
        setState(null, false, null);
      });
  }, []);

  const login = table => {
    setLoading(true);
    axios
      .post('/auth/login', table)
      .then(res => {
        setState(res.data.table, false, null);
        navigate('/');
      })
      .catch(err => {
        setState(null, false, err.response.data);
      });
  };

  const register = table => {
    setLoading(true);
    axios
      .post('/auth/register', table)
      .then(res => {
        setState(res.data.table, false, null);
        navigate('/');
      })
      .catch(err => {
        setState(null, false, err.response.data.errors);
      });
  };

  const logout = () => {
    axios.post('/auth/logout', {}).then(res => {
      navigate('/');
      window.location.reload();
    });
  };

  return (
    <AuthTableContext.Provider value={{ table, errors, loading, register, login, logout }}>
      {children}
    </AuthTableContext.Provider>
  );
}

export default AuthTableProvider;