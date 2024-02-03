import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthTableContext } from "./context/AuthTable";
import { Flowbite } from "flowbite-react";

function App() {
  const { table, loading } = useContext(AuthTableContext);
  return (
    <>
    <div className="bg-white dark:bg-black flex flex-col h-screen justify-between">
    <>{!loading && <>{table ? <p></p> : <Header  />}</>}</>
      <Main />
      <Footer />
      </div>
    </>
  );
}

export default App;
