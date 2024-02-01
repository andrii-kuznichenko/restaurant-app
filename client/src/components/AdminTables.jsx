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
            <h2>Your tables</h2>
            {tables.length === 0 ? (
                <p>No tables found for this restaurant.</p>
            ) : (
                <ul>
                    {tables.map(table => (
                        <li key={table._id} className='flex flex-row'>
                            Table Number: {table.tableNumber}
                            <CreateQrCode url={table.url} tableId={table._id} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminTables;
