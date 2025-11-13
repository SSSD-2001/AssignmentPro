import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import './home.css';

function TeacherDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([
    // Sample data - will be from database later
    { id: 1, title: "Math Assignment 1", dueDate: "2025-11-20", submissions: 15 },
    { id: 2, title: "Science Project", dueDate: "2025-11-25", submissions: 12 },
  ]);

  return (
    <div className="home-bg" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card feature-card p-4">
              <h2 className="mb-2">
                Welcome, <span style={{ color: '#6366f1' }}>{user?.username}</span>!
              </h2>
              <p className="text-muted mb-0">Teacher Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card feature-card h-100">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-journal-text"></i>
                </div>
                <h3 className="mt-2">{assignments.length}</h3>
                <p className="text-muted mb-0">Total Assignments</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card feature-card h-100">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-people"></i>
                </div>
                <h3 className="mt-2">45</h3>
                <p className="text-muted mb-0">Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card feature-card h-100">
              <div className="card-body text-center">
                <div style={{ fontSize: '2.5rem', color: '#6366f1' }}>
                  <i className="bi bi-check-circle"></i>
                </div>
                <h3 className="mt-2">27</h3>
                <p className="text-muted mb-0">Pending Reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Assignment Button */}
        <div className="row mb-4">
          <div className="col-12">
            <button className="btn hero-btn btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Assignment
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="row">
          <div className="col-12">
            <div className="card feature-card">
              <div className="card-body">
                <h4 className="mb-4">Your Assignments</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Assignment Title</th>
                        <th>Due Date</th>
                        <th>Submissions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map(assignment => (
                        <tr key={assignment.id}>
                          <td>{assignment.title}</td>
                          <td>{assignment.dueDate}</td>
                          <td>
                            <span className="badge bg-primary">{assignment.submissions} submissions</span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2">
                              <i className="bi bi-eye"></i> View
                            </button>
                            <button className="btn btn-sm btn-outline-secondary me-2">
                              <i className="bi bi-pencil"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
