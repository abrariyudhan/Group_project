import { useNavigate } from 'react-router'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

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
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          
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