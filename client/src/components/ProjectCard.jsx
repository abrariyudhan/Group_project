import { useNavigate } from 'react-router'
import http from '../helpers/http'
import Swal from 'sweetalert2'
import { useState } from 'react'

export default function ProjectCard({ project, onDelete }) {
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

      if (onDelete) {
        onDelete(project.id)
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
    <div className="card w-full bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        <h2 className="card-title text-primary">{project.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

        <div className="flex justify-between items-center mt-4">
          <span className={`badge text-dark ${project.status === 'Done' ? 'badge-success' : 'badge-warning'}`}>
            {project.status}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="btn btn-sm btn-outline btn-primary"
            >
              Open Board
            </button>


            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/projects/${project.id}/edit`)
              }}
              className="btn btn-sm btn-outline btn-warning"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-sm btn-outline btn-error"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}