import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import http from '../helpers/http'

export default function ProjectListPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await http.get('/projects', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      setProjects(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            onDelete={handleProjectDeleted}
          />
        ))}
      </div>
    </div>
  )
}