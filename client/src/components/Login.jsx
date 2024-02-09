import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ScanServeLogo from "../assets/ScanServeLogo.png";
import DarkModeToggle from "./darkModeToggle";

const Login = () => {
  const context = useContext(AuthContext);

  const [admin, setAdmin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    context.login(admin);
  };
  if (!context.loading && context.admin) {
    return <Navigate to="/" />;
  }

  if (!context.loading && !context.admin) {
    return (
      <>
        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900 my-5">
        <DarkModeToggle />
          <div className="flex justify-center items-center">
            <img
              src={ScanServeLogo}
              className="mr-4 h-11"
              alt="Scan&Serve Logo"
            />
            <span className="text-2xl font-bold">Scan & Serve</span>
          </div>
          {/* <!-- Card --> */}
          <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign in to platform
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  value={admin.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  value={admin.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember"
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
                >
                  Lost Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Login to your account
              </button>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Not registered?{" "}
                <Link
                  to="/register"
                  className="text-primary-700 hover:underline dark:text-primary-500"
                >
                  Create account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default Login;
