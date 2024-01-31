import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthTableContext } from "./context/AuthTable";
import { AuthContext } from "./context/Auth";

function App() {
  const { table, loading } = useContext(AuthTableContext);
  const {admin, logout} = useContext(AuthContext);
  return (
    <>
    <>{!loading && <>{table ? <p></p> : <Header admin={admin} logout={logout} />}</>}</>
      <Main />
      <Footer />
    </>
  );
}

export default App;
