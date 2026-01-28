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
        return <div className="container mt-5">Loading...</div>
    }

    return (
        <div className="container mt-5">
            <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
            
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Project Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        className="textarea textarea-bordered w-full"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        className="select select-bordered w-full"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        Update Project
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-ghost"
                        onClick={() => navigate(`/projects/${projectId}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}