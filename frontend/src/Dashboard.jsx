import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import './home.css';

function Dashboard() {
  const location = useLocation();
  const { user } = useAuth();
  const displayUser = location.state?.user || user;
  
  // Debug: Log the user object
  console.log('Dashboard - displayUser:', displayUser);
  console.log('Dashboard - role:', displayUser?.role);
  
  // Route to appropriate dashboard based on role
  if (displayUser?.role === 'teacher') {
    return <TeacherDashboard />;
  } else if (displayUser?.role === 'student') {
    return <StudentDashboard />;
  }
  
  // Fallback for users without role
  return (
    <div className="home-bg d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5 feature-card text-center" style={{ maxWidth: 500 }}>
        <h2 className="mb-4">Welcome, <span style={{ color: '#6366f1' }}>{displayUser?.username || 'User'}</span>!</h2>
        <p className="lead mb-3">You have successfully signed in to AssignmentPro.</p>
        <div className="mb-2">
          <strong>Username:</strong> {displayUser?.username}
        </div>
        <div className="mb-2 text-danger">
          <strong>Note:</strong> No role assigned. Please sign up again with a role.
        </div>
        <div className="mt-4">
          <a href="/" className="btn hero-btn">Go to Home</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
