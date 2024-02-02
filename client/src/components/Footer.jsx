import React from "react";
import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";
import { BiQr } from "react-icons/bi";

function Footer() {
  return (
    <div className="bg-orange-400 flex justify-between items-center p-4 bottom-0 w-full"
       style={{
        backgroundColor: 'var(--color-buttonBackground)',
        color: 'var(--color-buttonText)',
        position: "fixed",
        bottom: 0,
        left: 0,
      }}>

      <div className="flex">
        <a href="#" className="text-white mx-2">
          <FaGithub size={24} />
        </a>
        <a href="#" className="text-white mx-2">
          <FaTwitter size={24} />
        </a>
        <a href="#" className="text-white mx-2">
          <FaFacebook size={24} />
        </a>
      </div>
      <div>
        <BiQr className="text-white" size={24} />
      </div>
    </div>
  );
}

export default Footer;
