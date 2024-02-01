import React, { useState, useEffect, useContext } from 'react';
import axios from '../axiosInstance';
import { AuthContext } from '../context/Auth';
import CreateQrCode from './CreateQrCode';

const AdminTables = () => {
    const { admin } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (admin.restaurantId) {
            axios.get(`/auth/tables/${admin.restaurantId}`)
                .then(response => {
                    console.log(response)
                    const updatedTables = response.data.map(table => {
                        return {
                            ...table,
                            url: `http://localhost:5173/loginTable/${table._id}/${table.tableNumber}/${table.restaurantId}`
                        };
                    });
                    setTables(updatedTables);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                    setError('Failed to fetch tables');
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div className='my-4 border-2'>
            <h2 className='text-center py-4'>Your tables</h2>
            {tables.length === 0 ? (
                <p>No tables found for this restaurant.</p>
            ) : (
                <ul>
                    {tables.map(table => (
                        <li key={table._id} className='grid grid-cols-3 border-2'>
                            <div className='flex justify-center items-center font-bold'>Table {table.tableNumber}</div>
                            <div className='py-2'>QR Code: 
                            <img src={table.QRCode} alt="QRCode" width={200} height={200} />
                            </div>
                            <CreateQrCode url={table.url} tableId={table._id} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminTables;
