import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import { AuthTableContext } from '../context/AuthTable';
import {DefaultSidebar } from "./DefaultSidebar"

function Protected() {
  const { admin, loading } = useContext(AuthContext);
  const { table, loadingTable } = useContext(AuthTableContext);

  return <>{!loading && <>{admin ?  <Outlet />: !loadingTable && table ? <Navigate to="/user" /> : <Navigate to="/login"/>}</>}</>;
}

export default Protected;