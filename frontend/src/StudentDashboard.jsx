import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import './studentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([
    // Sample data - will be from database later
    { id: 1, title: "Math Assignment 1", dueDate: "2025-11-20", status: "pending", grade: null },
    { id: 2, title: "Science Project", dueDate: "2025-11-25", status: "submitted", grade: null },
    { id: 3, title: "History Essay", dueDate: "2025-11-15", status: "graded", grade: 85 },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="student-badge-pending">Pending</span>;
      case 'submitted':
        return <span className="student-badge-submitted">Submitted</span>;
      case 'graded':
        return <span className="student-badge-graded">Graded</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;

  return (
    <div className="student-dashboard">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card student-header-card p-4">
              <h2 className="mb-2">
                Welcome, <span style={{ color: '#fde047' }}>{user?.username}</span>!
              </h2>
              <p className="mb-0" style={{ opacity: 0.9 }}>Student Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card student-stat-card h-100">
              <div className="card-body text-center">
                <div className="student-stat-icon-pending">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h3 className="mt-2">{pendingCount}</h3>
                <p className="text-muted mb-0">Pending Assignments</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card student-stat-card h-100">
              <div className="card-body text-center">
                <div className="student-stat-icon-submitted">
                  <i className="bi bi-send-check"></i>
                </div>
                <h3 className="mt-2">{submittedCount}</h3>
                <p className="text-muted mb-0">Submitted</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card student-stat-card h-100">
              <div className="card-body text-center">
                <div className="student-stat-icon-graded">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h3 className="mt-2">{gradedCount}</h3>
                <p className="text-muted mb-0">Graded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="row">
          <div className="col-12">
            <div className="card student-table-card">
              <div className="card-body">
                <h4 className="mb-4">My Assignments</h4>
                <div className="table-responsive">
                  <table className="table student-table">
                    <thead>
                      <tr>
                        <th>Assignment Title</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Grade</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map(assignment => (
                        <tr key={assignment.id}>
                          <td>{assignment.title}</td>
                          <td>{assignment.dueDate}</td>
                          <td>{getStatusBadge(assignment.status)}</td>
                          <td>
                            {assignment.grade !== null ? (
                              <span className="student-grade">
                                {assignment.grade}%
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {assignment.status === 'pending' && (
                              <button className="btn btn-sm btn-primary student-action-btn">
                                <i className="bi bi-upload"></i> Submit
                              </button>
                            )}
                            {assignment.status === 'submitted' && (
                              <button className="btn btn-sm btn-outline-secondary student-action-btn">
                                <i className="bi bi-eye"></i> View Submission
                              </button>
                            )}
                            {assignment.status === 'graded' && (
                              <button className="btn btn-sm btn-outline-primary student-action-btn">
                                <i className="bi bi-file-text"></i> View Feedback
                              </button>
                            )}
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

export default StudentDashboard;
