import { useNavigate } from 'react-router'
import { useState } from 'react'
import http from '../helpers/http'
import Swal from 'sweetalert2'

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

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden transform hover:-translate-y-1">
      {/* Card Header with Gradient */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
      
      <div className="p-6">
        {/* Project Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
          {project.name}
        </h2>
        
        {/* Project Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {project.description}
        </p>
        
        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Status Badge - Clickable */}
          <button
            onClick={handleStatusClick}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${getStatusColor(project.status)} ${isUpdating ? 'opacity-50 cursor-wait' : 'hover:scale-110 hover:shadow-md cursor-pointer'}`}
            title="Click to change status"
          >
            {isUpdating ? 'Updating...' : project.status}
          </button>
          
          {/* Open Button */}
          <button 
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Open Board
          </button>
        </div>
      </div>
    </div>
  )
}