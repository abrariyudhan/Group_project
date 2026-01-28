import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Swal from 'sweetalert2';
import http from '../helpers/http';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Email and Password are required',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await http.post(`/register`, {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: `Account created for ${response.data.email}`,
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errorMessage,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-success bg-gradient">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient rounded-circle p-3 shadow">
                    <i className="bi bi-person-plus-fill text-white" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-center fw-bold mb-2 text-success">Create Account</h2>
                <p className="text-center text-muted mb-4">Sign up to get started</p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Role Select */}
                  <div className="mb-4">
                    <label htmlFor="role" className="form-label fw-semibold">
                      <i className="bi bi-person-badge me-2"></i>Role
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="owner">Owner</option>
                      <option value="collaborator">Collaborator</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check me-2"></i>
                          Register
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-success fw-semibold text-decoration-none">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-white mt-4 mb-0">
              <small>&copy; 2026 Your Company. All rights reserved.</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}