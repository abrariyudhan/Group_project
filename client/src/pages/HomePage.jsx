import { useState } from "react"
import { useNavigate } from "react-router"
import showError from "../helpers/errors"

export default function HomePage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const fetchProjects = async () => {
        try {
            
        } catch (error) {
            showError(error)
        }
    }
}