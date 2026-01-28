import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Swal from 'sweetalert2'
import http from '../helpers/http'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export default function ProjectDetail() {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [isMember, setIsMember] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchProjectDetail = async () => {
        try {
            const { data } = await http.get(`/projects/${projectId}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` }
            })
            setProject(data)

            const currentUserId = localStorage.getItem('userId')
            const checkMember = data.Users?.some(u => u.id == currentUserId)

            setIsMember(checkMember)
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch project details', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleJoin = async () => {
        try {
            await http.post(`/projects/${projectId}/join`, {}, {
                headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` }
            })
            Swal.fire('Success', 'You are now a contributor!', 'success');
            fetchProjectDetail()
        } catch (error) {
            Swal.fire('Error', 'Failed to join', 'error')
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
                timer: 100000
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
                message: `${localStorage.getItem('username')} updated "${taskName}" to ${nextStatus}`
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
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800">{project.name}</h1>
                    <p className="text-gray-600 mt-2">{project.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm font-semibold text-gray-500 mr-2">Contributors:</span>
                        {project?.Users?.map(user => (
                            <div key={user.id} className="badge badge-outline badge-primary">
                                {user.email === localStorage.getItem('user_email') ? 'You' : user.email}
                            </div>
                        ))}
                    </div>
                </div>

                {!isMember && (
                    <button onClick={handleJoin} className="btn btn-secondary animate-pulse">
                        Join to Participate
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="divide-y divide-gray-100">
                    {project.Activities.map((activity) => (
                        <div key={activity.id} className="p-6 flex items-center justify-between">
                            <div className="flex-1">
                                <p className={`text-lg ${activity.todoStatus === 'Done' ? 'line-through text-gray-400' : ''}`}>
                                    {activity.todo}
                                </p>
                                <span className="badge badge-ghost mt-2 text-dark">{activity.todoStatus}</span>
                            </div>

                            <div className="flex gap-2">
                                {isMember && activity.todoStatus !== 'Done' && (
                                    <button
                                        onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                        className={`btn btn-sm ${activity.todoStatus === 'On Progress' ? 'btn-success' : 'btn-primary'}`}
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