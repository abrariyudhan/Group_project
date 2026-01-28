import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import Navbar from "../components/Navbar"
import ProjectCard from "../components/ProjectCard"
import http from "../helpers/http"
import showError from "../helpers/errors"

export default function ProjectsListPage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchProjects = async () => {
        try {
            const { data } = await http.get('/projects', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            setProjects(data)
        } catch (error) {
            showError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    if (loading) {
        return (
            <>
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading projects...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="container mx-auto p-6">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                    <p className="text-gray-500">All your projects in one place</p>
                </header>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
                        <i className="bi bi-folder-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                        <p className="text-gray-500 mt-3">No projects yet. Create your first project!</p>
                        <button 
                            className="btn btn-primary mt-3"
                            onClick={() => navigate('/ai-generate')}
                        >
                            <i className="bi bi-magic me-2"></i>
                            Generate AI Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
