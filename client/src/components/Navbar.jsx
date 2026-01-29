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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid px-4">
                {/* LEFT SIDE - Brand/Logo */}
                {location.pathname !== '/' && (
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <i className="bi bi-kanban me-2" style={{ fontSize: '1.5rem' }}></i>
                        <span className="fw-bold">GO FLOW</span>
                    </Link>
                )}
                
                {/* Brand/Logo tanpa link di homepage */} 
                {location.pathname === '/' && (
                    <div className="navbar-brand d-flex align-items-center" style={{ cursor: 'default' }}>
                        <i className="bi bi-kanban me-2" style={{ fontSize: '1.5rem' }}></i>
                        <span className="fw-bold">GO FLOW</span>
                    </div>
                )}

                {/* CENTER - Create & My Project Buttons */}
                <div className="mx-auto d-flex gap-3">
                    {/* Create Project Button tanpa link di halaman create-project */}
                    {location.pathname !== '/create-project' && (
                        <Link
                            to="/create-project" // updated to /create-project
                            className="btn btn-light text-primary"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Create Project
                        </Link>
                    )}

                    {/* My Project Button - hidden di halaman projects dan project detail */}
                    {location.pathname !== '/projects' && !location.pathname.startsWith('/projects/') && (
                        <Link
                            to="/projects" // updated to /projects
                            className="btn btn-outline-light"
                        >
                            <i className="bi bi-folder me-2"></i>
                            My Project
                        </Link>
                    )}
                </div>

                {/* RIGHT SIDE - Logout Button */}
                <div className="d-flex align-items-center">
                    <Link to="/login">
                    <button
                        onClick={handleLogout} // logout handler
                        className="btn btn-outline-light" to="/login"
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button></Link>
                </div>
            </div>
        </nav>
    )
}