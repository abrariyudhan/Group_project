// navbar component
import { Link, useLocation } from 'react-router'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'

export default function Navbar() {
    const navigate = useNavigate() // untuk navigasi halaman
    const location = useLocation() // untuk mendapatkan path saat ini

    // logout handler
    const handleLogout = () => {
        localStorage.removeItem('access_token')
        Swal.fire({
            icon: 'success',
            title: 'Logged out',
            text: 'You have been logged out successfully',
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true
        })
        navigate('/login') // navigasi ke halaman login setelah logout
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* LEFT SIDE - Brand/Logo */}
                    {location.pathname !== '/' ? (
                        <Link to="/" className="flex items-center space-x-3 text-white hover:text-blue-100 transition">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            <span className="text-2xl font-bold">TaskFlow</span>
                        </Link>
                    ) : (
                        <div className="flex items-center space-x-3 text-white">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            <span className="text-2xl font-bold">TaskFlow</span>
                        </div>
                    )}

                    {/* CENTER - Navigation Buttons */}
                    <div className="flex items-center space-x-3">
                        {location.pathname !== '/ai-generate' && (
                            <Link
                                to="/ai-generate"
                                className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-md flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create Project</span>
                            </Link>
                        )}

                        {location.pathname !== '/projects' && !location.pathname.startsWith('/projects/') && (
                            <Link
                                to="/projects"
                                className="border-2 border-white text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white hover:text-blue-700 transition transform hover:scale-105 flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span>My Projects</span>
                            </Link>
                        )}
                    </div>

                    {/* RIGHT SIDE - Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red-600 transition transform hover:scale-105 shadow-md flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}