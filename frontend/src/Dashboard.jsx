import React from "react";
import { useLocation } from "react-router-dom";
import './home.css';

function Dashboard() {
  const location = useLocation();
  const user = location.state?.user;
  return (
    <div className="home-bg d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 feature-card text-center" style={{ maxWidth: 500 }}>
        <h2 className="mb-4">Welcome, <span style={{ color: '#6366f1' }}>{user?.username || 'User'}</span>!</h2>
        <p className="lead mb-3">You have successfully signed in to AssignmentPro.</p>
        <div className="mb-2">
          <strong>Username:</strong> {user?.username}
        </div>
        {/* Add more user details here if available */}
        <div className="mt-4">
          <a href="/" className="btn hero-btn">Go to Home</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
