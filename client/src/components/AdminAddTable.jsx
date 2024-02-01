import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/Auth";
import axios from "../axiosInstance";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateAndUploadQr } from "../generateAndUploadQr";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";

const AdminAddTable = () => {
  const { admin } = useContext(AuthContext);
  const [tableNumber, setTableNumber] = useState("");
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const qrCodeRef = useRef(null);

  const convertToImageAndUpload = async () => {
    try {
      const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
      const response = await axios.post("/auth/tables/qr-codes", { imageData: dataUrl });
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
      const qrCodeUrl = await convertToImageAndUpload();
      if (!qrCodeUrl) {
        throw new Error("QR code URL is undefined");
      }
      const payload = {
        QRCode: qrCodeUrl,
        restaurantId: admin.restaurantId,
        tableNumber,
      };
      const response = await axios.post("auth/addTable", payload);
      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error adding table");
    }
  };

//   const convertToImageAndUpload = () => {
//     htmlToImage
//       .toPng(qrCodeRef.current)
//       .then((dataUrl) => {
//         console.log("Generated Image URL:", dataUrl);
//         return axios
//           .post("/auth/tables/qr-codes", { imageData: dataUrl })
//           .then((response) => {
//             console.log("Response from Cloudinary:", response.data);
//             // updateTableDocument(response.data.url);
//             setQRCodeURL(response.data.url);
//             return response.data.url;
//           })
//           .catch((error) =>
//             console.error("Error uploading to Cloudinary:", error)
//           );
//       })
//       .catch((error) => console.error("Error generating QR code:", error));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const qrCodeUrl = await convertToImageAndUpload();
//       console.log(qrCodeUrl)
//       const payload = {
//         QRCode: qrCodeUrl,
//         restaurantId: admin.restaurantId,
//         tableNumber,
//       };
//       const response = await axios.post("auth/addTable", payload);
//       setSuccessMessage(response.data.message);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Error adding table");
//     }
//   };

  const qrCodeValue = `This is the qr code for ${tableNumber}`;

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
        <button type="submit">Add Table</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
      <div ref={qrCodeRef} style={ {position: 'absolute', left: '-10000px', top: '-10000px'}}>
        <QRCode value={qrCodeValue} size={256} />
      </div>
      {successMessage && <div className="text-center">{successMessage}</div>}{" "}
    </>
  );
};

export default AdminAddTable;
