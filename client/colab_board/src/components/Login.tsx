import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { login } from "../api/auth"
import { useMutation } from '@tanstack/react-query'
import { useAuthState } from "../context/AuthContext"

export default function Login(){
    const {setLoggedIn} = useAuthState()
    const [email, setEmail] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from ? `${location.state.from.pathname}${location.state.from.search}${location.state.from.hash}` : '/'

    const [error, setError] = useState('')
    
    const loginMutation = useMutation({
        mutationFn: async() => {
            if (email === null || password === null) {
                setError('Email and password are required')
                return
            }
            const {accessToken} = await login(email, password)
            return accessToken
        },
        onSuccess: (accessToken) => {
            setLoggedIn(true)
            localStorage.setItem("accessToken", accessToken)
            navigate(from, { replace: true })
        },
        onError: (err) => setError(err.message)
    })

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
            setError('Invalid email address')
            return
        }

        setError('')

        loginMutation.mutate()
    }
    
    function buttonText(){
        return loginMutation.isPending ? "Loging in..." : "Log in"
    }

    return (
        <div className="flex justify-center min-h-dvh bg-[#f3f3f3] w-full px-4">
            <div className="flex flex-col gap-2 w-full max-w-md">
                <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-10 mt-20 sm:mt-40">
                    Collaborative Whiteboard
                </h1>
                <div className="flex flex-col bg-white rounded-[18px] py-5 w-full">
                    <h1 className="text-2xl font-bolder ml-6">Log in</h1>
                    <form
                        className="flex flex-col mx-4 sm:mx-6"
                        onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            className="bg-[#f3f3f3] grow min-w-0 mt-4 px-2 py-2 rounded-lg border border-[#aaa]"
                            value={email ?? ""}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            className="bg-[#f3f3f3] grow min-w-0 my-4 px-2 py-2 rounded-lg border border-[#aaa]"
                            value={password ?? ""}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                        />
                        {error && <p className="text-red">{error}</p>}
                        <button
                            type="submit"
                            className="shrink-0 cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-black border-2 border-transparent font-medium rounded-lg px-4 py-2"
                        >
                            {buttonText()}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}