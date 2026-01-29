import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Swal from 'sweetalert2';
import http from '../helpers/http';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await http.post(`/login`, {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('userId', response.data.id)
      localStorage.setItem('username', response.data.username)
      
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
              <div className="p-8">
                {/* Logo */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-4 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-center text-3xl font-bold mb-2 text-blue-900">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-6">Please login to your account</p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Input */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-2 -mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 inline mr-2 -mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                          ) : (
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mb-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 17l5-5-5-5v10z"/>
                            <path d="M3 3h8v2H5v14h6v2H3V3z"/>
                          </svg>
                          Login
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition">
                      Register here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-center text-white mt-6 mb-0 text-sm">
              &copy; 2026 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}