import { useState, useEffect } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains("dark")) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <div
      onClick={toggleDarkMode}
      className={`relative inline-block w-11 align-middle select-none transition duration-200 ease-in transform hover:scale-105 hover:cursor-pointer ${
        darkMode ? "" : ""
      }`}
    >
      <input
        type="checkbox"
        name="toggle"
        id="toggle"
        className="toggle-checkbox hidden"
        checked={darkMode}
        readOnly
      />
      <label
        htmlFor="toggle"
        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"
      ></label>
      <span
        className={`toggle-icon absolute top-0 ${
          darkMode ? "right-0" : "left-0"
        } ${
          darkMode ? "bg-black text-gray-300" : "bg-white text-black"
        } w-6 h-6 rounded-full shadow inset-y-0 flex items-center justify-center transition-transform duration-300 ease-in-out`}
      >
        {darkMode ? "🌙" : "☀️"}
      </span>
    </div>
  );
}

export default DarkModeToggle;
