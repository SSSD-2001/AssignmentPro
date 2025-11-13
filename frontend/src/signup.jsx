import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./signup.css";


function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const normalizedUsername = formData.username.trim().toLowerCase();
      const payload = {
        ...formData,
        username: normalizedUsername
      };
      console.log('Signup payload:', payload); // Debug
      const res = await axios.post("http://localhost:3000/signup", payload);
      console.log('Signup response:', res.data); // Debug
      if (res.data && res.data.user) {
        login(res.data.user);
        navigate("/dashboard", { state: { user: res.data.user } });
      }
    } catch (error) {
      alert(error?.response?.data?.message || error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="text-center mb-4">
          <h2 className="font-weight-bold">Sign Up</h2>
          <p className="mb-0" style={{ color: '#c7d2fe' }}>Create your account to get started.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Choose a username"
              required
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Create a password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group mb-4">
            <label className="d-block mb-2">I am a:</label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleStudent"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="roleStudent">
                  Student
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleTeacher"
                  value="teacher"
                  checked={formData.role === 'teacher'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="roleTeacher">
                  Teacher
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="auth-btn btn btn-block w-100" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-3">
          <span style={{ color: '#c7d2fe' }}>Already have an account? </span>
          <a href="/signin" className="auth-link">Sign In</a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;