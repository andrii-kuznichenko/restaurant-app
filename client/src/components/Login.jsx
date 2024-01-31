import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate } from "react-router-dom";

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
        {context.errors?.message}
        <form onSubmit={handleSubmit}>
          <label htmlFor="">Email:</label>
          <input
            type="email"
            name="email"
            value={admin.email}
            onChange={handleChange}
            required
            className="w-full mb-5 p-2 border border-gray-300 rounded"
          />
          <label htmlFor="">Password:</label>
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
            required
            className="w-full mb-5 p-2 border border-gray-300 rounded"
          />
          <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        </form>
      </>
    );
  }
};

export default Login;
