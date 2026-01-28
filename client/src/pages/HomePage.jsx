import { useState } from "react"
import { useNavigate } from "react-router"
import showError from "../helpers/errors"
import Navbar from "../component/Navbar"

export default function HomePage() {
    // const [projects, setProjects] = useState([])
    // const [loading, setLoading] = useState(true)
    // const navigate = useNavigate()

    // const fetchProjects = async () => {
    //     try {
            
    //     } catch (error) {
    //         showError(error)
    //     }
    // }
    return (
        <>
        <Navbar />
        <div className="container mt-5">
            <h1>Welcome to Go Flow</h1>
            <p>Your project management solution</p>
        </div>
        </>
    )
}