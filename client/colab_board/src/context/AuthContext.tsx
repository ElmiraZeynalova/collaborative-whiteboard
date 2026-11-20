import { createContext } from 'react'

type AuthContextValue = {
  loggedIn: boolean | "loading"
}

export type Session = {
  userId: string;
} | null;

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

