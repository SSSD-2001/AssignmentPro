import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import './studentDashboard.css';

function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`/api/assignments/student/${user?.username}`);
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText(assignment.submission?.submissionText || '');
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      alert('Please enter your submission');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/assignments/${selectedAssignment._id}/submit`, {
        studentUsername: user?.username,
        submissionText
      });
      alert('Assignment submitted successfully!');
      setShowSubmitModal(false);
      setSubmissionText('');
      setSelectedAssignment(null);
      fetchAssignments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Error submitting assignment');
    } finally {
      setLoading(false);
    }
  };

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
                      {assignments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">No assignments assigned to you yet.</td>
                        </tr>
                      ) : (
                        assignments.map(assignment => (
                          <tr key={assignment._id}>
                            <td>{assignment.title}</td>
                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td>{getStatusBadge(assignment.status)}</td>
                            <td>
                              {assignment.submission?.grade !== null && assignment.submission?.grade !== undefined ? (
                                <span className="student-grade">
                                  {assignment.submission.grade}/{assignment.maxScore}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {assignment.status === 'pending' && (
                                <button 
                                  className="btn btn-sm btn-primary student-action-btn"
                                  onClick={() => openSubmitModal(assignment)}
                                >
                                  <i className="bi bi-upload"></i> Submit
                                </button>
                              )}
                              {assignment.status === 'submitted' && (
                                <button 
                                  className="btn btn-sm btn-outline-secondary student-action-btn"
                                  onClick={() => openSubmitModal(assignment)}
                                >
                                  <i className="bi bi-eye"></i> View Submission
                                </button>
                              )}
                              {assignment.status === 'graded' && assignment.submission?.feedback && (
                                <button 
                                  className="btn btn-sm btn-outline-primary student-action-btn"
                                  onClick={() => alert(`Feedback: ${assignment.submission.feedback}`)}
                                >
                                  <i className="bi bi-file-text"></i> View Feedback
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Assignment: {selectedAssignment.title}</h3>
              <button className="modal-close" onClick={() => setShowSubmitModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <p><strong>Description:</strong> {selectedAssignment.description}</p>
                  <p><strong>Due Date:</strong> {new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                  <p><strong>Max Score:</strong> {selectedAssignment.maxScore}</p>
                </div>
                <div className="form-group mb-3">
                  <label>Your Submission *</label>
                  <textarea
                    className="form-control"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    required
                    rows="8"
                    placeholder="Enter your assignment answer here..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
