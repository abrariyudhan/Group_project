// aigeneratepage for generating project using AI
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import http from '../helpers/http'
import Swal from 'sweetalert2'
import showError from '../helpers/errors'

export default function AIGeneratePage() {
    const [prompt, setPrompt] = useState('') // project description input
    const [loading, setLoading] = useState(false) // loading state
    const navigate = useNavigate() // for navigation

    const handleSubmit = async (e) => { // handle untuk submit form
        e.preventDefault()
        
        if (!prompt.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Prompt',
                text: 'Please describe your project idea',
                confirmButtonColor: '#0d6efd'
            })
            return
        }

        setLoading(true)
        try {
            const { data } = await http.post('/projects/generate-ai', // endpoint untuk generate AI project
                { prompt },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('access_token')}`// ambil token dari local storage
                    }
                }
            )

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message || 'AI Project created successfully!',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            })

            // Redirect ke ProjectPage dengan project yang baru dibuat
            navigate(`/projects/${data.project.id}`)
        } catch (error) {
            showError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-primary text-white">
                                <h4 className="mb-0">
                                    <i className="bi bi-magic me-2"></i>
                                    Generate AI Project
                                </h4>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted mb-4">
                                    Jelaskan ide proyek kamu, lalu biarkan AI menghasilkan rencana proyek lengkap beserta daftar tugasnya.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="prompt" className="form-label fw-semibold">
                                            <i className="bi bi-lightbulb me-2"></i>
                                            Project Description
                                        </label>
                                        <textarea
                                            id="prompt"
                                            className="form-control form-control-lg"
                                            rows="6"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Example: Create a mobile app for fitness tracking with exercise logging and progress charts"
                                            disabled={loading}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Example Prompts */}
                                    <div className="alert alert-light border mb-4">
                                        <small className="fw-semibold d-block mb-2">
                                            <i className="bi bi-stars me-1"></i>
                                            Example prompts:
                                        </small>
                                        <small className="d-block text-muted">
                                            • "Kembangkan situs web e-commerce untuk kerajinan tangan (handmade crafts)."
                                        </small>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/')}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary flex-grow-1"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Generating Project...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-magic me-2"></i>
                                                    Generate Project
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="card mt-3 border-0 bg-light">
                            <div className="card-body">
                                <h6 className="fw-semibold mb-2">
                                    <i className="bi bi-robot me-2"></i>
                                    How it works:
                                </h6>
                                <ul className="small text-muted mb-0">
                                    <li>AI analyzes your project description</li>
                                    <li>Generates a project name and detailed description</li>
                                    <li>Creates a list of tasks to complete the project</li>
                                    <li>Organizes tasks in a kanban board format</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
