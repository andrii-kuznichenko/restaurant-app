import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthTableContext } from "./context/AuthTable";
import { AuthContext } from "./context/Auth";
import UserPayment from "./components/UserPayment";

function App() {
  const { table, loading } = useContext(AuthTableContext);
  return (
    <>
    <>{!loading && <>{table ? <p></p> : <Header  />}</>}</>
      <Main />
      <UserPayment />
      <Footer />
    </>
  );
}

export default App;
