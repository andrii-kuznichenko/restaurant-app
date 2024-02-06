import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../axiosInstance";
import { AuthContext } from "../context/Auth";
import CreateQrCode from "./CreateQrCode";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import AdminAddTable from "./AdminAddTable";

const AdminTables = () => {
  const { admin } = useContext(AuthContext);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrCodeRef = useRef(null);
  const [tableAddedCount, setTableAddedCount] = useState(0);

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

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  console.log(tables);
  return (
    <div className="my-4">
      <h2 className="text-center py-4">Your tables</h2>
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
                      onClick={downloadQRCode}
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        // <ul>
        //     {tables.map(table => (
        //         <li key={table._id} className='grid grid-cols-3 border-2'>
        //             <div className='flex justify-center items-center font-bold'>Table {table.tableNumber}</div>
        //             <div className='py-2'>QR Code:
        //             <img src={table.QRCode} alt="QRCode" width={200} height={200} />
        //             </div>
        //             <CreateQrCode url={table.url} tableId={table._id} />
        //         </li>
        //     ))}
        // </ul>
      )}
      <h2 className="text-2xl text-center">Add a table</h2>
      <AdminAddTable onTableAdded={onTableAdded}/>
    </div>
  );
};

export default AdminTables;
