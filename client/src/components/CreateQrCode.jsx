import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";
import axios from "../axiosInstance";

const CreateQrCode = ( {url, tableId} ) => {
//   const [url, setUrl] = useState("");
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (qrIsVisible) {
      convertToImageAndUpload();
    }
  }, [qrIsVisible]);

  const handleQrCodeGenerator = () => {
    if (!url) {
      return;
    }
    setQrIsVisible(true);
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

  const convertToImageAndUpload = () => {
    htmlToImage.toPng(qrCodeRef.current)
      .then((dataUrl) => {
        console.log("Generated Image URL:", dataUrl);
        // Upload to Cloudinary
        return axios.post('/auth/tables/qr-codes', { imageData: dataUrl })
          .then(response => {
            console.log("Response from Cloudinary:", response.data);
            // Update MongoDB document
            updateTableDocument(response.data.url);
          })
          .catch(error => console.error("Error uploading to Cloudinary:", error));
      })
      .catch(error => console.error("Error generating QR code:", error));
  };

  const updateTableDocument = (qrCodeUrl) => {
    console.log("Updating table with ID:", tableId, "and QRCode URL:", qrCodeUrl);
    axios.post('/auth/tables/update-qr-code', { tableId, qrCodeUrl })
      .then(response => console.log("Table updated", response.data))
      .catch(error => console.error("Error updating table:", error));
  };



  return (
    <div className="qrcode__container flex flex-row my-3">
      <button onClick={handleQrCodeGenerator}>Generate QR Code</button>
      {qrIsVisible && (
        <div className="qrcode__download" ref={qrCodeRef}>
          <div className="qrcode__image">
            <QRCode value={url} size={300} />
            <button onClick={downloadQRCode}>Download QR Code</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQrCode;
