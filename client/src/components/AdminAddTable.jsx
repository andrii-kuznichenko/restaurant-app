import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/Auth";
import axios from "../axiosInstance";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
// `http://localhost:5173/loginTable/${table._id}/${table.tableNumber}/${table.restaurantId}`

const AdminAddTable = () => {
  const { admin } = useContext(AuthContext);
  const [tableNumber, setTableNumber] = useState("");
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState('')
  const qrCodeRef = useRef(null);


  const createTableAndGetId = async () => {
    try {
      const response = await axios.post("auth/addTable", {
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
      
      const tableId = await createTableAndGetId();
      const qrCodeValueURL = `http://localhost:5173/loginTable/${tableId}/${tableNumber}/${admin.restaurantId}`;
      
      
      setQrCodeValue(qrCodeValueURL);
      const qrCodeUrl = await convertToImageAndUpload();

     
      await axios.post("auth/tables/update-qr-code", { tableId, qrCodeUrl });
      setSuccessMessage("Table created and QR code updated successfully.");
    } catch (error) {
        console.log(error)
      setErrorMessage(error.response?.data?.message || "Error processing request");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center my-2 gap-2"
      >
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        {/* <input
          type="text"
          placeholder="QR Code"
          value={QRCode}
          onChange={(e) => setQRCode(e.target.value)}
        />  */}
        <button type="submit" className="border-2 hover:bg-blue-500">Add Table</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
      <div ref={qrCodeRef} width={200} height={200} >
        <QRCode value={qrCodeValue} size={256} />
      </div>
      {successMessage && <div className="text-center">{successMessage}</div>}{" "}
    </>
  );
};

export default AdminAddTable;
