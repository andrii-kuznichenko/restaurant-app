import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Navigate } from 'react-router-dom';
function Register() {
  const context = useContext(AuthContext);
  const errors = context.errors;
  const [admin, setAdmin] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    context.register(admin);
  };
  // if admin exist go to home
  if (!context.loading && context.admin) {
    return <Navigate to="/" />;
  }

  if (!context.loading && !context.admin) {
    return (
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="">Login:</label>
        {errors?.login && <p className="text-danger">{errors?.login.message}</p>}
        <input type="text" name="login" value={admin.lodin} onChange={handleChange} required />
        <label htmlFor="">Email:</label>
        {errors?.email && <p className="text-danger">{errors?.email.message}</p>}
        <input type="email" name="email" value={admin.email} onChange={handleChange} required />
        <label htmlFor="">Password:</label>
        {errors?.password && <p className="text-danger">{errors?.password.message}</p>}
        <input
          type="password"
          name="password"
          value={admin.password}
          onChange={handleChange}
          required
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
        />
        <button>Register</button>
      </form>
    );
  }
}

export default Register;