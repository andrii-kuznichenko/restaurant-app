
import { DefaultSidebar } from "./DefaultSidebar";
import { Link } from "react-router-dom";
import axios from "../axiosInstance";
import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/Auth";


const AdminDashboard = () => {
    const { admin, loading } = useContext(AuthContext);
  return (
   <>
   
<div className="grid h-full grid-cols-5 gap-x-0 gap-y-0" style={{ gridTemplateRows: 'repeat(5, 1fr)' }}>
    <div className="div1 flex flex-col justify-center" style={{ gridArea: '1 / 1 / 6 / 2' }}>
        <DefaultSidebar />
        
        {/* <div className="text-white">Restaurant</div>
        <div className="text-white">Menu</div>
        <div className="text-white">Orders</div> */}
    </div>
    <div className="div2 bg-red-700 justify-center flex items-center" style={{ gridArea: '2 / 2 / 6 / 6' }}>
        <div>Something...</div>
    </div>
    <div className="div3 bg-orange-100 flex justify-end pr-3 pt-5" style={{ gridArea: '1 / 2 / 2 / 6' }}>
    <div>Hello {admin.login}</div>
        
    </div>
    

   
</div>

   </>
  );
};

export default AdminDashboard;

