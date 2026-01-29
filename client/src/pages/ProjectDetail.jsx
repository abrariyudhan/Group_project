import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import http from '../helpers/http'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

export default function ProjectDetail() {
    const { projectId } = useParams()
    const navigate = useNavigate()
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
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-blue-700 font-semibold text-lg">Loading project...</p>
                </div>
            </div>
        )
    }

    const statusColumns = {
        'Not Started': project.Activities.filter(a => a.todoStatus === 'Not Started'),
        'On Progress': project.Activities.filter(a => a.todoStatus === 'On Progress'),
        'Done': project.Activities.filter(a => a.todoStatus === 'Done')
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

                        {!isMember && (
                            <button 
                                onClick={handleJoin} 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform transition hover:scale-105 flex items-center space-x-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span>Join Project</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Kanban Board - Trello Style */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Not Started Column */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
                        <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-4 rounded-t-xl">
                            <div className="flex items-center justify-between text-white">
                                <h3 className="text-lg font-bold flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Not Started
                                </h3>
                                <span className="bg-white text-gray-700 text-sm font-bold px-3 py-1 rounded-full">
                                    {statusColumns['Not Started'].length}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {statusColumns['Not Started'].map((activity) => (
                                <div key={activity.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-200 border-l-4 border-gray-400 group">
                                    <p className="text-gray-800 mb-4 font-medium leading-relaxed">{activity.todo}</p>
                                    {isMember && (
                                        <button
                                            onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold py-3 px-4 rounded-lg transition-all transform group-hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Start Task
                                        </button>
                                    )}
                                </div>
                            ))}
                            {statusColumns['Not Started'].length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="font-semibold">No tasks here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* On Progress Column */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 rounded-t-xl">
                            <div className="flex items-center justify-between text-white">
                                <h3 className="text-lg font-bold flex items-center">
                                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    On Progress
                                </h3>
                                <span className="bg-white text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
                                    {statusColumns['On Progress'].length}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {statusColumns['On Progress'].map((activity) => (
                                <div key={activity.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-200 border-l-4 border-blue-500 group">
                                    <p className="text-gray-800 mb-4 font-medium leading-relaxed">{activity.todo}</p>
                                    {isMember && (
                                        <button
                                            onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold py-3 px-4 rounded-lg transition-all transform group-hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Complete Task
                                        </button>
                                    )}
                                </div>
                            ))}
                            {statusColumns['On Progress'].length === 0 && (
                                <div className="text-center py-16 text-blue-300">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-semibold">No tasks in progress</p>
                                </div>
                            )}
                        </div>
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
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {statusColumns['Done'].map((activity) => (
                                <div key={activity.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-green-500 opacity-90">
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-gray-600 line-through font-medium leading-relaxed">{activity.todo}</p>
                                    </div>
                                </div>
                            ))}
                            {statusColumns['Done'].length === 0 && (
                                <div className="text-center py-16 text-green-300">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-semibold">No completed tasks yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}