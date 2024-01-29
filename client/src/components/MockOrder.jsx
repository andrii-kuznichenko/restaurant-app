import React, {useEffect} from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_BASE_URL, { transports: ['websocket'] });

function MockOrder() {
  const mockOrderData = {
    operation: 'add',
    tableNumberId: '65b428a00b61fb0f41d40fb6', 
    meals: [
      { name: '65b2d6899f642d0b3e3b04b1', quantity: 2 }, 
      { name: '65b2debea687ee49a00630ee', quantity: 1 },
    ],
    totalPrice: 100, 
    restaurantId: '65b3b26aef210c44a63af9b2',
    mockUserRole: 'user', 
  };

  const placeMockOrder = () => {
    socket.emit('connectToOrder', mockOrderData);
    console.log('Mock order placed:', mockOrderData);
  };

  useEffect(() => {
    return () => {
        socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Mock Order</h2>
      <button onClick={placeMockOrder}>Place Mock Order</button>
    </div>
  );
}

export default MockOrder;