import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";

const CreateQrCode = ( {url} ) => {
//   const [url, setUrl] = useState("");
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const handleQrCodeGenerator = () => {
    if (!url) {
      return;
    }
    setQrIsVisible(true);
  };
  return (
    <div className="qrcode__container flex flex-row my-3">
      <button onClick={handleQrCodeGenerator}>Generate QR Code</button>
      {qrIsVisible && (
        <div className="qrcode__download">
          <div className="qrcode__image">
            <QRCode value={url} size={300} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQrCode;
