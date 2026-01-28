import { useNavigate } from 'react-router'
import http from '../helpers/http'
import Swal from 'sweetalert2'
import { useState } from 'react'

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()

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