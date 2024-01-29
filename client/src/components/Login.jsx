import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/Auth';
import { Navigate } from 'react-router-dom';

const Login = () => {

    const context = useContext(AuthContext);

    const [admin, setAdmin] = useState({
        email: '',
        password: '',
      });
    
      const handleChange = e => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
      };
      const handleSubmit = e => {
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
          <input type="email" name="email" value={admin.email} onChange={handleChange} required />
          <label htmlFor="">Password:</label>
          <input
            type="text"
            name="password"
            value={admin.password}
            onChange={handleChange}
            required
          />
          <button>Login</button>
        </form>
      </>
    );
}
}

export default Login;