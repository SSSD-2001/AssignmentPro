import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import './teacherDashboard.css';

function TeacherDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
    assignedTo: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchStudents();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`/api/assignments?teacherUsername=${user?.username}`);
      setAssignments(res.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/users/students');
      setStudents(res.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSelection = (studentUsername) => {
    setFormData(prev => {
      const isSelected = prev.assignedTo.includes(studentUsername);
      return {
        ...prev,
        assignedTo: isSelected
          ? prev.assignedTo.filter(s => s !== studentUsername)
          : [...prev.assignedTo, studentUsername]
      };
    });
  };

  const selectAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      assignedTo: students.map(s => s.username)
    }));
  };

  const deselectAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      assignedTo: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.assignedTo.length === 0) {
      alert('Please select at least one student');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/assignments', {
        ...formData,
        teacherUsername: user?.username
      });
      alert('Assignment created successfully!');
      setShowModal(false);
      setFormData({ title: "", description: "", dueDate: "", maxScore: 100, assignedTo: [] });
      fetchAssignments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`/api/assignments/${id}`);
      alert('Assignment deleted successfully!');
      fetchAssignments();
    } catch (error) {
      alert('Error deleting assignment');
    }
  };

  return (
    <div className="teacher-dashboard">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card teacher-header-card p-4">
              <h2 className="mb-2">
                Welcome, <span style={{ color: '#fbbf24' }}>{user?.username}</span>!
              </h2>
              <p className="mb-0" style={{ opacity: 0.9 }}>Teacher Dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card teacher-stat-card h-100">
              <div className="card-body text-center">
                <div className="teacher-stat-icon">
                  <i className="bi bi-journal-text"></i>
                </div>
                <h3 className="mt-2">{assignments.length}</h3>
                <p className="text-muted mb-0">Total Assignments</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card teacher-stat-card h-100">
              <div className="card-body text-center">
                <div className="teacher-stat-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3 className="mt-2">45</h3>
                <p className="text-muted mb-0">Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card teacher-stat-card h-100">
              <div className="card-body text-center">
                <div className="teacher-stat-icon">
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
            <button 
              className="btn teacher-create-btn btn-lg"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create New Assignment
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div className="row">
          <div className="col-12">
            <div className="card teacher-table-card">
              <div className="card-body">
                <h4 className="mb-4">Your Assignments</h4>
                <div className="table-responsive">
                  <table className="table teacher-table">
                    <thead>
                      <tr>
                        <th>Assignment Title</th>
                        <th>Due Date</th>
                        <th>Submissions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">No assignments yet. Create your first assignment!</td>
                        </tr>
                      ) : (
                        assignments.map(assignment => (
                          <tr key={assignment._id}>
                            <td>{assignment.title}</td>
                            <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                            <td>
                              <span className="badge teacher-badge">
                                {assignment.assignedTo?.length || 0} students assigned
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary teacher-action-btn">
                                <i className="bi bi-eye"></i> View
                              </button>
                              <button className="btn btn-sm btn-outline-secondary teacher-action-btn">
                                <i className="bi bi-pencil"></i> Edit
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger teacher-action-btn"
                                onClick={() => handleDelete(assignment._id)}
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
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

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Assignment</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Assignment Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Math Quiz 1"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Describe the assignment requirements..."
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Max Score</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="100"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Assign to Students *</label>
                  <div className="mb-2">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={selectAllStudents}
                    >
                      Select All
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={deselectAllStudents}
                    >
                      Deselect All
                    </button>
                    <span className="ms-2 text-muted">
                      ({formData.assignedTo.length} selected)
                    </span>
                  </div>
                  <div className="student-selection-box" style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '10px'
                  }}>
                    {students.length === 0 ? (
                      <p className="text-muted mb-0">No students found</p>
                    ) : (
                      students.map(student => (
                        <div key={student.username} className="form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`student-${student.username}`}
                            checked={formData.assignedTo.includes(student.username)}
                            onChange={() => handleStudentSelection(student.username)}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={`student-${student.username}`}
                          >
                            {student.username}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn teacher-create-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
