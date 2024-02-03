import React from "react";
import { FaGithub, FaTwitter, FaFacebook } from "react-icons/fa";
import { BiQr } from "react-icons/bi";

function Footer() {
  return (
    <div className="fixed bottom-0 bg-indigo1 flex justify-between items-center p-4 w-full">
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