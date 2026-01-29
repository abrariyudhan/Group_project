import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        username: localStorage.getItem('username') || "",
        id: localStorage.getItem('userId') || ""
    })

    const login = (userData) => {
        setUser({
            username: userData.username,
            id: userData.id
        })
        localStorage.setItem('access_token', userData.access_token)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('userId', userData.id)
    }

    const logout = () => {
        setUser({ username: "", id: "" })
        localStorage.clear()
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}