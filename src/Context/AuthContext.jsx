import {createContext, useContext, useState, useEffect } from 'react'
import { auth } from "../Firebase/Firebase"
import { onAuthStateChanged, signOut } from 'firebase/auth'

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])
    const logout = () => {
        signOut(auth)
    }
    const value = {
        currentUser, 
        logout,
        loading
    }
    return <AuthContext.Provider value = {value}>
        {children}
    </AuthContext.Provider>
}