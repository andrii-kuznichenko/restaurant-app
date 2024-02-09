import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import AdminAddTable from "./AdminAddTable";
import { useNotification } from '../context/Notification';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const AdminTables = () => {
  const { admin } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrCodeRef = useRef(null);
  const [tableAddedCount, setTableAddedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { notify } = useNotification();
  // const { notify } = useNotification();
  

  useEffect(() => {
    if (admin.restaurantId) {
      axios
        .get(`/auth/tables/${admin.restaurantId}`)
        .then((response) => {
          console.log(response);
          const updatedTables = response.data.map((table) => {
            return {
              ...table,
              url: `http://localhost:5173/loginTable/${table._id}/${table.tableNumber}/${table.restaurantId}`,
            };
          });
          setTables(updatedTables);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tables:", error);
          setError("Failed to fetch tables");
          setLoading(false);
        });
    }
  }, [tableAddedCount]);

  const onTableAdded = () => {
    setTableAddedCount((count) => count + 1);
  };

  const downloadQRCode = async (qrCodeUrl, tableNumber) => {
    try {
      const response = await fetch(qrCodeUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `qr-code-table-${tableNumber}.png`; // You can dynamically set the filename if needed
      document.body.appendChild(link); 
      link.click();
      document.body.removeChild(link); 
      window.URL.revokeObjectURL(downloadUrl); 
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  // const downloadQRCode = () => {
  //   htmlToImage
  //     .toPng(qrCodeRef.current)
  //     .then(function (dataUrl) {
  //       const link = document.createElement("a");
  //       link.href = dataUrl;
  //       link.download = "qr-code.png";
  //       link.click();
  //     })
  //     .catch(function (error) {
  //       console.error("Error generating QR code:", error);
  //     });
  // };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(tables);

  const triggerNotification = () => {
    notify()
  }


  return (
    <div className="my-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="mx-4 py-4 text-3xl font-bold">Your tables</h1>
        <button
          type="button"
          className="text-white bg-footerBackground bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={openModal}
        >
          Add table
        </button>
      </div>
      {tables.length === 0 ? (
        <p>No tables found for this restaurant.</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-10">
          {tables.map((table) => (
            <div
              key={table._id}
              className="flip-card  gap-2 aspect-square block max-w-sm  bg-white border border-gray-200 rounded-lg shadow hover:cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col justify-center items-center"
            >
              <div className="flip-card-inner rounded-lg ">
                <div className="flip-card-front flex flex-col justify-center items-center">
                  <div className="h-auto max-w-full rounded-lg text-center  aspect-square justify-center items-center flex text-2xl">
                    {table.tableNumber}
                  </div>
                  <span className="material-symbols-outlined">
                    table_restaurant
                  </span>
                </div>
                <div className="flip-card-back flex flex-col justify-center items-center bg-slate-300 rounded-lg">
                  <div className="flex flex-col justify-center items-center gap-1 pt-2">
                    <QRCode
                      value={table.QRCode}
                      //   width={130}
                      //   height={130}
                      className="qr-code-new mb-2"
                      ref={qrCodeRef}
                    />
                    {/* <img
                      src={table.QRCode}
                      alt="QRCode"
                      width={180}
                      height={180}
                      className="rounded-lg"
                    /> */}
                    <button
                      className="text-white font-bold"
                      onClick={() => downloadQRCode(table.QRCode, table.tableNumber)}
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <AdminAddTable
        isOpen={isModalOpen}
        closeModal={closeModal}
        onTableAdded={onTableAdded}
      /> */}
      <AdminAddTable onTableAdded={onTableAdded} isModalOpen={isModalOpen} closeModal={closeModal} className="mt-20 z-50"/>
      {/* <ToastContainer />  */}
    </div>
  );
};

export default AdminTables;
