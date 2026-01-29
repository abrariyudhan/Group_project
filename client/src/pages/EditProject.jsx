import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import http from '../helpers/http'
import Swal from 'sweetalert2'

export default function EditProjectPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Not Started'
    })
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { projectId } = useParams() 

    useEffect(() => {
        fetchProjectData()
    }, [projectId])

    const fetchProjectData = async () => {
        try {
            const response = await http.get(`/projects/${projectId}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            setFormData({
                name: response.data.name,
                description: response.data.description,
                status: response.data.status
            })
            setLoading(false)
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load project data',
                icon: 'error'
            })
            navigate('/projects')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await http.put(`/projects/${projectId}`, formData, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            Swal.fire({
                title: 'Success!',
                text: 'Project updated successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            })

            navigate(`/projects/${projectId}`) 
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update project',
                icon: 'error'
            })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Loading project...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="container mx-auto px-6 max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                        Edit Project
                    </h1>
                    <p className="text-gray-600 text-lg">Update project information and status</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                required
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Update Project
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/projects/${projectId}`)}
                                className="px-6 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}