import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/Auth";
import axios from "../axiosInstance";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { Link } from "react-router-dom";

const AdminAddTable = ({ onTableAdded, isModalOpen, closeModal }) => {
  const { admin } = useContext(AuthContext);
  const [tableNumber, setTableNumber] = useState("");
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const qrCodeRef = useRef(null);
  const [captureQRCode, setCaptureQRCode] = useState(false);
  const [tableId, setTableId] = useState(null);
  //   const [qrCodeVisible, setQrCodeVisible] = useState(false);

  useEffect(() => {
    if (captureQRCode && tableId) {
      const capture = async () => {
        const qrCodeUrl = await convertToImageAndUpload();
        await axios.post("/auth/tables/update-qr-code", { tableId, qrCodeUrl });
        setCaptureQRCode(false);

        setSuccessMessage("Table created and QR code updated successfully.");
        onTableAdded();
      };
      capture().catch(console.error);
    }
  }, [captureQRCode, tableId, onTableAdded]);

  const createTableAndGetId = async () => {
    try {
      const response = await axios.post("/auth/addTable", {
        restaurantId: admin.restaurantId,
        tableNumber,
      });
      return response.data.table._id;
    } catch (error) {
      console.error("Error creating table:", error);
      throw error;
    }
  };

  const convertToImageAndUpload = async () => {
    try {
      const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
      console.log(dataUrl);
      const response = await axios.post("/auth/tables/qr-codes", {
        imageData: dataUrl,
      });
      setQRCodeURL(response.data.url);
      return response.data.url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newTableId = await createTableAndGetId();
      setTableId(newTableId);
      const qrCodeValueURL = `https://scan-service.onrender.com/loginTable/${newTableId}/${tableNumber}/${admin.restaurantId}`;
      console.log(qrCodeValueURL);

      setQrCodeValue(qrCodeValueURL); // sets the qrCodeValue to http://localhost etc...
      setCaptureQRCode(true);
      setTableNumber("");
      setTimeout(() => {
        setQrCodeValue("");
      }, 5000);

      //   setQrCodeVisible(true);
      //   const qrCodeUrl = await convertToImageAndUpload();

      //   await axios.post("auth/tables/update-qr-code", { tableId, qrCodeUrl });
      //   setSuccessMessage("Table created and QR code updated successfully.");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "Error processing request"
      );
    }
  };
 
  if (!isModalOpen) return null;

  return (
    <>
      {/* <div id="default-modal" tabIndex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-2xl max-h-full">
        
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Terms of Service
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            
            <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                </p>
            </div>
            
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                <button data-modal-hide="default-modal" type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
            </div>
        </div>
    </div>
</div> */}

      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      >
        <div className="modal-content bg-white p-4 rounded-lg flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center my-2 gap-2"
          >
            <input
              type="number"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="mb-2"
            />
            {/* <input
          type="text"
          placeholder="QR Code"
          value={QRCode}
          onChange={(e) => setQRCode(e.target.value)}
        />  */}
            <button
              type="submit"
              className="border-2 hover:bg-blue-500 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Add Table
            </button>
            {errorMessage && <p>{errorMessage}</p>}
          </form>

          {qrCodeValue && (
            <div
              width={200}
              height={200}
              className="flex flex-col items-center text-center py-6"
            >
              <QRCode
                value={qrCodeValue}
                size={256}
                ref={qrCodeRef}
                className="mb-2"
              />
              <div>
                Table {tableNumber} was succesfully created.✅ <br />
                Qr code was generated and saved. ✅ <br />
                {/* <br /> See all tables <Link to="/admin/tables" className="font-bold">here</Link> or
            create another table. */}
              </div>
            </div>
          )}

          <button onClick={closeModal} className="m-4">
            Close
          </button>
        </div>
      </div>

      {/* {successMessage && <div className="text-center">{successMessage}</div>}{" "} */}
    </>
  );
};

export default AdminAddTable;
