import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./signin.css";


function SignIn() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
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
            const res = await axios.post("http://localhost:3000/signin", {
                ...formData,
                username: normalizedUsername
            });
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
                        <h2 className="font-weight-bold">Sign In</h2>
                        <p className="mb-0" style={{ color: '#c7d2fe' }}>Welcome back! Please sign in to your account.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>
                        <button type="submit" className="auth-btn btn btn-block w-100" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <span style={{ color: '#c7d2fe' }}>Don't have an account? </span>
                        <a href="/signup" className="auth-link">Sign Up</a>
                    </div>
                </div>
            </div>
        );
}

export default SignIn;
