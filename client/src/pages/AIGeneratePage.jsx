import { useState } from 'react'
import { useNavigate } from 'react-router'
import Navbar from '../components/Navbar'
import http from '../helpers/http'
import Swal from 'sweetalert2'
import showError from '../helpers/errors'

export default function AIGeneratePage() {
    const [prompt, setPrompt] = useState('') 
    const [loading, setLoading] = useState(false) 
    const navigate = useNavigate() 

    const handleSubmit = async (e) => {
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
            const { data } = await http.post('/projects/generate-ai', 
                { prompt },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('access_token')}`
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

            navigate(`/projects/${data.project.id}`)
        } catch (error) {
            showError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-6 py-10">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                                <h4 className="text-2xl font-bold flex items-center">
                                    <svg className="w-7 h-7 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>
                                    </svg>
                                    Generate AI Project
                                </h4>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-600 mb-6">
                                    Jelaskan ide proyek kamu, lalu biarkan AI menghasilkan rencana proyek lengkap beserta daftar tugasnya.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 mb-2">
                                            <svg className="w-5 h-5 inline mr-2 -mt-1 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                                            </svg>
                                            Project Description
                                        </label>
                                        <textarea
                                            id="prompt"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                                            rows="6"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Example: Create a mobile app for fitness tracking with exercise logging and progress charts"
                                            disabled={loading}
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Example Prompts */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <div className="font-semibold text-sm text-blue-900 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                                            </svg>
                                            Example prompts:
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            • "Kembangkan situs web e-commerce untuk kerajinan tangan (handmade crafts)."
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            type="button" 
                                            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => navigate('/')}
                                            disabled={loading}
                                        >
                                            <svg className="w-4 h-4 inline mr-2 -mt-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                            </svg>
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generating Project...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>
                                                    </svg>
                                                    Generate Project
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 mt-6 p-6">
                            <h6 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM12 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 17.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/>
                                </svg>
                                How it works:
                            </h6>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                    </svg>
                                    AI analyzes your project description
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                    </svg>
                                    Generates a project name and detailed description
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                    </svg>
                                    Creates a list of tasks to complete the project
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                    </svg>
                                    Organizes tasks in a kanban board format
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
