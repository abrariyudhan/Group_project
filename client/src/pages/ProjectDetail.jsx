import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Swal from 'sweetalert2'
import http from '../helpers/http'
import { io } from 'socket.io-client'
import { UserContext } from '../context/userContext'

const socket = io('http://localhost:3000')

export default function ProjectDetail() {
    const { projectId } = useParams()
    const [project, setProject] = useState(null)
    const [isMember, setIsMember] = useState(false)
    const [loading, setLoading] = useState(true)

    const { user: currentUser } = useContext(UserContext)

    const fetchProjectDetail = async () => {
        try {
            const { data } = await http.get(`/projects/${projectId}`, {
                headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` }
            })
            setProject(data)

            const checkMember = data.Users.some(u => Number(u.id) == Number(currentUser.id))

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
    }, [projectId, currentUser.id])

    const handleUpdateStatus = async (activityId, currentStatus, taskName) => {
        try {
            let nextStatus = currentStatus === 'Not Started' ? 'On Progress' : 'Done'

            await http.patch(`/activities/${activityId}`,
                { todoStatus: nextStatus },
                { headers: { authorization: `Bearer ${localStorage.getItem('access_token')}` } }
            )

            socket.emit('updateTask', {
                projectId,
                message: `${currentUser.username} updated "${taskName}" to ${nextStatus}`
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
                            <p className="text-gray-600 mb-3">{project.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Contributors:</span>
                                {project.Users.map(user => (
                                    <span key={user.id} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                                        {user.username === localStorage.getItem('username') ? '👤 You' : user.username}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {!isMember && (
                            <button 
                                onClick={handleJoin} 
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transform transition hover:scale-105 animate-pulse flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Join to Participate
                            </button>
                        )}
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Not Started Column */}
                    <div className="bg-gray-50 rounded-xl shadow-md">
                        <div className="bg-gray-600 text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-bold text-lg">Not Started</h3>
                            </div>
                            <span className="bg-gray-800 text-white font-bold text-sm px-3 py-1 rounded-full">{notStartedTasks.length}</span>
                        </div>
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {notStartedTasks.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">No tasks yet</p>
                                </div>
                            ) : (
                                notStartedTasks.map(activity => (
                                    <div key={activity.id} className="bg-white border-l-4 border-gray-500 rounded-lg shadow-sm hover:shadow-md transition p-4">
                                        <p className="text-gray-800 font-medium mb-3">{activity.todo}</p>
                                        {isMember && (
                                            <button
                                                onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Start Task
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* On Progress Column */}
                    <div className="bg-blue-50 rounded-xl shadow-md">
                        <div className="bg-blue-600 text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <h3 className="font-bold text-lg">On Progress</h3>
                            </div>
                            <span className="bg-blue-800 text-white font-bold text-sm px-3 py-1 rounded-full">{onProgressTasks.length}</span>
                        </div>
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {onProgressTasks.length === 0 ? (
                                <div className="text-center py-12 text-blue-300">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-sm font-medium">No tasks in progress</p>
                                </div>
                            ) : (
                                onProgressTasks.map(activity => (
                                    <div key={activity.id} className="bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition p-4">
                                        <p className="text-gray-800 font-medium mb-2">{activity.todo}</p>
                                        {activity.User && (
                                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                {activity.User.username}
                                            </p>
                                        )}
                                        {isMember && activity.userId === Number(localStorage.getItem('userId')) && (
                                            <button
                                                onClick={() => handleUpdateStatus(activity.id, activity.todoStatus, activity.todo)}
                                                className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Complete Task
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Done Column */}
                    <div className="bg-green-50 rounded-xl shadow-md">
                        <div className="bg-green-600 text-white px-5 py-4 rounded-t-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-bold text-lg">Done</h3>
                            </div>
                            <span className="bg-green-800 text-white font-bold text-sm px-3 py-1 rounded-full">{doneTasks.length}</span>
                        </div>
                        <div className="p-4 space-y-3 min-h-[400px]">
                            {doneTasks.length === 0 ? (
                                <div className="text-center py-12 text-green-300">
                                    <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">No completed tasks yet</p>
                                </div>
                            ) : (
                                doneTasks.map(activity => (
                                    <div key={activity.id} className="bg-white border-l-4 border-green-500 rounded-lg shadow-sm p-4 opacity-75">
                                        <p className="text-gray-600 font-medium line-through">{activity.todo}</p>
                                        {activity.User && (
                                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                Completed by {activity.User.username}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
