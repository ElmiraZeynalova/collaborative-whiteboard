import { createContext, useContext, useEffect, type ReactNode } from 'react'
import {userIsValid} from "../api/auth"
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useClientStore } from '../store/clientStore'

type AuthContextValue = {
  loggedIn: boolean | "loading"
}

type Session = {
  userId: string;
} | null;

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const setUserId = useClientStore(state => state.setUserId)

  const query = useQuery<Session>({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        return userIsValid();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loggedIn: boolean | "loading" = query.isPending ? "loading" : query.isError ? false : query.data !== null && query.data !== undefined;

  useEffect(() => {
    if (query.isPending || query.isError) return;

    setUserId(query.data?.userId ?? null);
  }, [query.data, query.isPending, query.isError, setUserId]);


  useEffect(() => {
    const handleLogout = () => {
      setUserId(null)
      queryClient.setQueryData(['session'], null)
      queryClient.removeQueries({
          predicate: query => query.queryKey[0] !== 'session',
      })
     }

    window.addEventListener('auth:logout', handleLogout)

    return () => {
        window.removeEventListener('auth:logout', handleLogout)
    }
  }, [queryClient, setUserId])

  return (
    <AuthContext.Provider value={{ loggedIn }}>
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