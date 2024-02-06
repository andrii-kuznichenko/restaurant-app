import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
  transports: ["websocket"],
})

export const AuthTableContext = createContext();

function AuthTableProvider({ children }) {
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [loadingTable, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [userMenu, setUserMenu] = useState([]);
  const [categories, setCategories] = useState([]);

  const setState = (table, loadingTable, errors) => {
    setTable(table);
    setLoading(loadingTable);
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

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      transports: ["websocket"],
    });
    if(table) {
      socket.emit("connectToMenu", {restaurantId: table.restaurantId});
      socket.on(`getMenuUser-${table.restaurantId}`, (receivedMenu) => {
        setUserMenu(receivedMenu);
      });
    }
  }, [table])

  useEffect(() => {
    if(userMenu.menu && userMenu.menu.length > 0){
      const newArrayCategories = userMenu.menu.map(meal => meal.category);
      const uniqCategories = [...new Set(newArrayCategories)]
      setCategories(uniqCategories);
    }
  }, [userMenu])

  const login = table => {
    setLoading(true);
    axios
      .post('/auth/login', table)
      .then(res => {
        setState(res.data.table, false, null);
        navigate('/user');
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
        navigate('/user');
      })
      .catch(err => {
        setState(null, false, err.response.data.errors);
      });
  };

  const logout = () => {
    axios.post('/auth/logout', {}).then(res => {
      navigate('/user');
      window.location.reload();
    });
  };

  const updateSelectedItem = (item) => {
    setSelectedItem((prevSelectedItem) =>
      prevSelectedItem?._id === item._id ? null : item
    );
  };

  const updateOrderItems = (item) => {
    const existingItem = orderItems.find((orderItem) => orderItem._id === item._id);

    if (existingItem) {
      setOrderItems((prevItems) =>
        prevItems.map((orderItem) =>
          orderItem._id === item._id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
    }

    setTotal((prevTotal) => prevTotal + item.price);
  };


  return (
    <AuthTableContext.Provider value={{ table, errors, loadingTable, register, login, logout, selectedItem, userMenu, orderItems, total, updateSelectedItem, updateOrderItems, categories}}>
      {children}
    </AuthTableContext.Provider>
  );
}

export default AuthTableProvider;