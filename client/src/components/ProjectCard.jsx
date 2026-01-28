import { useNavigate } from 'react-router'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        <h2 className="card-title text-primary">{project.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className={`badge text-dark ${project.status === 'Done' ? 'badge-success' : 'badge-warning'}`}>
            {project.status}
          </span>
          
          <button 
            onClick={() => navigate(`/projects/${project.id}`)}
            className="btn btn-sm btn-outline btn-primary"
          >
            Open Board
          </button>
        </div>
      </div>
    </div>
  )
}