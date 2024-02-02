import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthTableContext } from '../context/AuthTable';

function Protected() {
  const { table, loadingTable } = useContext(AuthTableContext);

  return <>{!loadingTable && <>{table ? <Outlet /> : <Navigate to="/user" />}</>}</>;
}

export default Protected;