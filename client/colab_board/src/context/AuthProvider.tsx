import { userIsValid } from "../api/auth"
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useClientStore } from '../store/clientStore'
import { useEffect, type ReactNode } from 'react'
import { type Session, AuthContext } from './AuthContext'

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
