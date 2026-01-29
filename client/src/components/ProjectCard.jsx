import { useState } from 'react'
import { useNavigate } from 'react-router'
import http from '../helpers/http'
import Swal from 'sweetalert2'
import { useState } from 'react'

export default function ProjectCard({ project, onStatusUpdate }) {
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'On Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const handleStatusClick = async (e) => {
    e.stopPropagation()
    
    if (isUpdating) return

    const statusOptions = ['Not Started', 'On Progress', 'Done']
    const currentIndex = statusOptions.indexOf(project.status)
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length]

    try {
      setIsUpdating(true)
      await http({
        method: 'PATCH',
        url: `/projects/${project.id}/status`,
        data: { status: nextStatus },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      if (onStatusUpdate) onStatusUpdate()

      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Status changed to "${nextStatus}"`,
        timer: 1500,
        showConfirmButton: false
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Failed to update status',
        text: err.response?.data?.message || 'Something went wrong'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${project.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) return

    try {
      await http.delete(`/projects/${project.id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      Swal.fire({
        title: 'Deleted!',
        text: `"${project.name}" has been deleted.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      if (onStatusUpdate) {
        onStatusUpdate()
      }
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete project. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
      {/* Card Header with Gradient Strip */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
      
      <div className="p-6">
        {/* Project Title */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {project.name}
          </h2>
        </div>
        
        {/* Project Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 h-10">
          {project.description}
        </p>
        
        {/* Status Badge */}
        <div className="mb-4">
          <button
            onClick={handleStatusClick}
            disabled={isUpdating}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200 ${getStatusColor(project.status)} ${isUpdating ? 'opacity-50 cursor-wait' : 'hover:scale-105 hover:shadow-md cursor-pointer active:scale-95'}`}
            title="Click to change status"
          >
            {isUpdating ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating...</span>
              </span>
            ) : (
              project.status
            )}
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button 
            onClick={() => navigate(`/projects/${project.id}`)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Open Board</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center"
            title="Delete Project"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}