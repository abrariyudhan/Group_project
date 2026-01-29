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
        if (projectId) {
            fetchProjectDetail()

            socket.emit('joinProject', projectId)

            socket.on('taskUpdated', (payload) => {
                fetchProjectDetail()

                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'info',
                    title: payload.message,
                    showConfirmButton: false,
                    timer: 30000
                })
            })
        }

        return () => {
            socket.off('taskUpdated')
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Header */}
            <div className="bg-white border-b-4 border-blue-600 shadow-md">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1">
                            {/* Back Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4 transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Projects
                            </button>

                            <h1 className="text-4xl font-bold text-gray-900 mb-3">{project.name}</h1>
                            <p className="text-gray-600 text-lg mb-4">{project.description}</p>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-bold text-gray-700 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    Contributors:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {project?.Users?.map(user => (
                                        <div key={user.id} className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border-2 border-blue-300 shadow-sm">
                                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            {user.email === localStorage.getItem('user_email') ? 'You' : user.username || user.email}
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                        <>
                                            {activity.todoStatus === 'On Progress' && activity.userId !== Number(localStorage.getItem('userId')) ? (
                                                <span className="text-xs text-gray-400 italic">Worked on by {activity.User.username || 'someone'}</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                                    className={`btn btn-sm ${activity.todoStatus === 'On Progress' ? 'btn-success' : 'btn-primary'}`}
                                                >
                                                    {activity.todoStatus === 'Not Started' ? 'Start Task' : 'Finish Task'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}