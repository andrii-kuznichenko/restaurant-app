import { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    if (document.body.classList.contains('dark')) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <button
      className={`p-2 rounded ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
      onClick={toggleDarkMode}
    >
      Toggle Dark Mode
    </button>
  );
}

export default DarkModeToggle;