import * as htmlToImage from "html-to-image";
import axios from "./axiosInstance"; 

export const generateAndUploadQr = async (qrCodeRef) => {
  if (!qrCodeRef.current) {
    throw new Error("QRCode ref is not available");
  }

  const dataUrl = await htmlToImage.toPng(qrCodeRef.current);
  const response = await axios.post('/auth/tables/qr-codes', { imageData: dataUrl });
  return response.data.url;
  console.log(response.data.url)
};