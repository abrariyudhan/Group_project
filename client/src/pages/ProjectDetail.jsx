import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Swal from 'sweetalert2'
import http from '../helpers/http'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export default function ProjectDetail() {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProjectDetail = async () => {
        try {
            const { data } = await http.get(`/projects/${projectId}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` }
            })
            setProject(data)
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch project details', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjectDetail()

        // 1. Join project saat masuk halaman
        socket.emit('joinProject', projectId)

        // 2. Dengerin kalau ada kabar update dari user lain
        socket.on('taskUpdated', (payload) => {
            fetchProjectDetail()
            Swal.fire({
                toast: true,
                position: 'top-end',
                title: payload.message,
                showConfirmButton: false,
                timer: 3000
            })
        })

        return () => {
            socket.emit('leaveProject', projectId)
            socket.off('taskUpdated') // Bersihkan listener saat pindah page
        }
    }, [projectId])

    const handleUpdateStatus = async (activityId, currentStatus, taskName) => {
        try {
            let nextStatus = currentStatus === 'Not Started' ? 'On Progress' : 'Done'

            await http.patch(`/activities/${activityId}`,
                { todoStatus: nextStatus },
                { headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` } }
            )

            socket.emit('updateTask', {
                projectId,
                message: `Someone updated "${taskName}" to ${nextStatus}`
            })

            fetchProjectDetail()
        } catch (error) {
            Swal.fire('Error', error.response.data.message || 'Failed to update status', 'error')
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">{project.name}</h1>
                <p className="text-gray-600 mt-2">{project.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700">Activities / To-do List</h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {project.Activities.map((activity) => (
                        <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                                <p className={`text-lg ${activity.todoStatus === 'Done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {activity.todo}
                                </p>
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full mt-2 inline-block ${activity.todoStatus === 'On Progress' ? 'bg-blue-100 text-blue-600' :
                                    activity.todoStatus === 'Done' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {activity.todoStatus}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {activity.todoStatus !== 'Done' && (
                                    <button
                                        onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                        disabled={activity.todoStatus === 'Done'}
                                        className={`btn btn-sm ${activity.todoStatus === 'On Progress' ? 'btn-success' : 'btn-primary'
                                            }`}
                                    >
                                        {activity.todoStatus === 'Not Started' ? 'Start Task' : 'Finish Task'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}