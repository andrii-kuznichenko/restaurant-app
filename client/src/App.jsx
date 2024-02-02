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
    <Flowbite>
    <>{!loading && <>{table ? <p></p> : <Header  />}</>}</>
      <Main />
      <Footer />
    </Flowbite>  
    </>
  );
}

export default App;
