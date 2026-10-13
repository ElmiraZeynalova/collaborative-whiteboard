import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {userIsValid} from "../api/auth"
import axios from 'axios'

interface AuthContextValue {
  loggedIn: boolean
  setLoggedIn: (state: boolean) => void

}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const handleLogout = () => setLoggedIn(false)

    window.addEventListener('auth:logout', handleLogout)

    return () => {
        window.removeEventListener('auth:logout', handleLogout)
    }
  }, [])

  useEffect(() => {
    async function verifySession() {
        try {
            await userIsValid()
            setLoggedIn(true)
        } catch (error) {
            setLoggedIn(false)

            if (axios.isAxiosError(error)) {
                console.error(
                    'Session verification failed:',
                    error.response?.status ?? error.message
                )
            }
        } 
    }

    verifySession()
}, [])

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthState must be used within AuthProvider')
  }
  return context
}