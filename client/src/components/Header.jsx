import { useContext } from 'react';

import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
function Header() {
  const { admin, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <nav>
        <div>
          <NavLink className="nav-link" to={'/'}>
            Home
          </NavLink>
    
        </div>
        <>
          {admin ? (
            <div className="header-admin">
              <p>Hello: {admin.login}</p>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="header-admin">
              <NavLink className="nav-link" to={'/login'}>
                Login
              </NavLink>
              <span> | </span>
              <NavLink className="nav-link" to={'/register'}>
                Register
              </NavLink>
            </div>
          )}
        </>
      </nav>
    </header>
  );
}

export default Header;