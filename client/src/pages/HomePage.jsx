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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-6 py-10">
                {/* Hero Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl p-10 mb-10">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h1 className="text-5xl font-extrabold">My Projects</h1>
                            </div>
                            <p className="text-blue-100 text-lg font-medium">
                                ✨ Manage your tasks and collaborate with your team
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    <span className="font-semibold">{projects.length} Projects</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="group bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-blue-50 transform transition hover:scale-110 flex items-center gap-3"
                            onClick={() => navigate('/ai-generate')}
                        >
                            <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-lg">New AI Project</span>
                        </button>
                    </div>
                </div>
                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <div className="relative">
                                <svg className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-6" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <p className="text-gray-700 font-semibold text-lg">Loading your amazing projects...</p>
                        </div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="relative">
                        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="mb-6 relative inline-block">
                                <svg className="w-32 h-32 text-gray-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No projects yet! 🚀</h3>
                            <p className="text-gray-600 mb-8 text-lg">Start your journey by creating your first project with AI magic!</p>
                            <button 
                                className="group bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 transform transition hover:scale-105 inline-flex items-center gap-3"
                                onClick={() => navigate('/ai-generate')}
                            >
                                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <span className="text-lg">Generate AI Project</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                All Projects
                            </h2>
                            <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-semibold">
                                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                            {projects.map((project, index) => (
                                <div 
                                    key={project.id}
                                    className="transform transition-all duration-300 hover:scale-105"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ProjectCard 
                                        project={project} 
                                        onStatusUpdate={fetchProjects}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}