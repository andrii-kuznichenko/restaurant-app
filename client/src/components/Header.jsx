import React from "react";
import { NavLink } from "react-router-dom";

const Header = ({ admin, logout }) => {
  return (
    <header className="bg-blue-500 p-4 text-white">
      <nav className="flex justify-between">
        <div>
          <NavLink className="text-white hover:text-gray-300" to={"/"}>
            Home
          </NavLink>
        </div>
        <div>
          {admin ? (
            <div className="flex items-center space-x-4">
              <p>Hello: {admin.login}</p>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink className="text-white hover:text-gray-300" to={"/login"}>
                Login
              </NavLink>
              <span className="text-white"> | </span>
              <NavLink
                className="text-white hover:text-gray-300"
                to={"/register"}
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
