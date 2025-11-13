



import React from 'react';
import { useAuth } from './AuthContext';
import './home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-bg container-fluid p-0">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center justify-content-center">
        <div className="text-center px-3 px-md-5">
          <h1 className="display-3 hero-title mb-3">AssignmentPro</h1>
          <p className="lead mb-4" style={{ fontSize: '1.5rem' }}>
            Empowering teachers and students to collaborate, manage, and excel in academic assignments—anytime, anywhere.
          </p>
          {user ? (
            <a href="/dashboard" className="btn btn-lg hero-btn font-weight-bold">Go to Dashboard</a>
          ) : (
            <>
              <a href="/signup" className="btn btn-lg hero-btn font-weight-bold">Get Started</a>
              <a href="/signin" className="btn btn-lg hero-btn font-weight-bold">Sign In</a>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
  <section className="container py-5">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="font-weight-bold" style={{ color: '#3730a3' }}>Why AssignmentPro?</h2>
            <p className="text-muted">A seamless platform for assignment management, feedback, and analytics.</p>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card card h-100 shadow border-0">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-journal-check"></i>
                </div>
                <h5 className="card-title font-weight-bold">For Students</h5>
                <p className="card-text">Access assignments, submit work, track deadlines, and view grades—all in one place. Stay organized and never miss a deadline again.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card card h-100 shadow border-0">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-person-badge"></i>
                </div>
                <h5 className="card-title font-weight-bold">For Teachers</h5>
                <p className="card-text">Design assignments, manage submissions, give feedback, and generate performance analytics. Simplify your workflow and save valuable time.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card card h-100 shadow border-0">
              <div className="card-body">
                <div className="mb-3" style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-bar-chart-line"></i>
                </div>
                <h5 className="card-title font-weight-bold">Analytics</h5>
                <p className="card-text">Gain insights into student performance, identify trends, and help every learner reach their full potential with powerful analytics tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="cta-section text-center py-5">
          <h2 className="mb-3 font-weight-bold">Ready to get started?</h2>
          <a href="/signup" className="btn btn-lg cta-btn font-weight-bold">Create an Account</a>
          <a href="/signin" className="btn btn-lg cta-btn font-weight-bold">Sign In</a>
        </section>
      )}
    </div>
  );
}

export default Home;