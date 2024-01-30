import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthTableContext } from '../context/AuthTable';

function Protected() {
  const { table, loading } = useContext(AuthTableContext);

  return <>{!loading && <>{table ? <Outlet /> : <Navigate to="/loginTable" />}</>}</>;
}

export default Protected;