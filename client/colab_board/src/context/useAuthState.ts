import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuthState() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthState must be used within AuthProvider')
    }
    return context
}