import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './navbar.css'; // Import the CSS file for the navbar

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <a className="navbar-brand" href="/">AssignmentPro</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {user ? (
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                onClick={handleLogout}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/signin">Sign In</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">Sign Up</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;