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
    <div className="flex space-x-2 justify-center items-center bg-white h-screen dark:invert">
      <Lottie
        options={defaultOptions}
        height={200}
        width={700}
        style={{
          width: "80%",
        }}
      />
    </div>
  );
}

export default LoadingDots;
