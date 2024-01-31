import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

function Protected() {
  const { admin, loading } = useContext(AuthContext);

  return <>{!loading && <>{admin ? <Outlet /> : <Navigate to="/login" />}</>}</>;
}

export default Protected;