import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "../animations/loadingAnimation.json";

function LoadingDots() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  return (
    <div className="flex justify-center items-center bg-white h-screen dark:bg-gray-900">
      <Lottie options={defaultOptions} height={300} width={700} />
    </div>
  );
}

export default LoadingDots;
