import React, { useState, useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate } from "react-router-dom";

function Register() {
  const context = useContext(AuthContext);
  const errors = context.errors;
  const [admin, setAdmin] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    context.register(admin);
  };

  if (!context.loading && context.admin) {
    return <Navigate to="/" />;
  }

  if (!context.loading && !context.admin) {
    return (
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="">Login:</label>
        {errors?.login && <p className="text-danger">{errors?.login.message}</p>}
        <input
          type="text"
          name="login"
          value={admin.login}
          onChange={handleChange}
          required
          className="w-full mb-5 p-2 border border-gray-300 rounded"
        />
        <label htmlFor="">Email:</label>
        {errors?.email && <p className="text-danger">{errors?.email.message}</p>}
        <input
          type="email"
          name="email"
          value={admin.email}
          onChange={handleChange}
          required
          className="w-full mb-5 p-2 border border-gray-300 rounded"
        />
        <label htmlFor="">Password:</label>
        {errors?.password && <p className="text-danger">{errors?.password.message}</p>}
        <input
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          required
          className="w-full mb-5 p-2 border border-gray-300 rounded"
        />
        <label htmlFor="">Confirm Password:</label>
        {errors?.confirmPassword && (
          <p className="text-danger">{errors?.confirmPassword.message}</p>
        )}
        <input
          type="password"
          name="confirmPassword"
          value={admin.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mb-5 p-2 border border-gray-300 rounded"
        />
        <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    );
  }
}

export default Register;
