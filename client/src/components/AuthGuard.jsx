import { Navigate, Outlet } from "react-router"
import Navbar from "./Navbar"

export function AuthProtected() {
    const token = localStorage.getItem('access_token')
    if (!token) {
        return <Navigate to='/login' />
    }
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
} 

export function PublicOnly() {
    const token = localStorage.getItem('access_token')
    if (token) {
        return <Navigate to='/' />
    }
    return (
        <div>
            {/* <Navbar /> */}
            <Outlet />
        </div>
    )
}