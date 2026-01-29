import { useState } from "react"
import { useNavigate } from "react-router"
import showError from "../helpers/errors"
import { useEffect } from "react"
import http from "../helpers/http"
import ProjectCard from "../components/ProjectCard"
import Swal from "sweetalert2"

export default function HomePage() {
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

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <p className="text-gray-500">
                        Welcome back! Manage your tasks here.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        className="btn btn-primary shadow-md"
                        onClick={() => navigate('/ai-generate')}
                    >
                        + New AI Project
                    </button>

                    <button
                        className="btn btn-primary shadow-md"
                        onClick={() => navigate('/create-project')}
                    >
                        + New Project
                    </button>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
                    <p className="text-gray-500">No projects yet. Try creating one with AI!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            fetchProjects={fetchProjects} />
                    ))}
                </div>
            )}
        </div>

        )
}