import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/Auth";
import axios from "../axiosInstance";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import { Link } from "react-router-dom";

const AdminAddTable = () => {
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
        await axios.post("auth/tables/update-qr-code", { tableId, qrCodeUrl });
        setCaptureQRCode(false);
        setSuccessMessage("Table created and QR code updated successfully.");
      };
      capture().catch(console.error);
    }
  }, [captureQRCode, tableId]);

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
      const qrCodeValueURL = `http://localhost:5173/loginTable/${newTableId}/${tableNumber}/${admin.restaurantId}`;
      console.log(qrCodeValueURL);

      setQrCodeValue(qrCodeValueURL); // sets the qrCodeValue to http://localhost etc...
      setCaptureQRCode(true);
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
        <button type="submit" className="border-2 hover:bg-blue-500">
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
            <br /> See all tables <Link to="/admin/tables" className="font-bold">here</Link> or
            create another table.
          </div>
        </div>
      )}

      {/* {successMessage && <div className="text-center">{successMessage}</div>}{" "} */}
    </>
  );
};

export default AdminAddTable;
