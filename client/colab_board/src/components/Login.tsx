import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../api/auth"
import { useMutation } from '@tanstack/react-query'
import { useClientStore } from "../store/clientStore"
import { generateColor } from "./Board/Board"

export default function Login(){
    const userName = useClientStore(state => state.userName)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserId = useClientStore(state => state.setUserId)
    const [email, setEmail] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)
    const navigate = useNavigate()
    const [error, setError] = useState('')
    
    const loginMutation = useMutation({
        mutationFn: async() => {
            if (email === null || password === null || userName === null) {
                setError('Email, username and password are required')
                return
            }
            const id = crypto.randomUUID()
            setUserId(id)
            const accessToken = await login(id, userName, email, password)
            return accessToken
        },
        onSuccess: (accessToken) => {
            localStorage.setItem("accessToken", accessToken)
            const user = {
                name: userName,
                color: generateColor()
            }
            localStorage.setItem('user', JSON.stringify(user))
            navigate("/")
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
                    <form
                        className="flex flex-col mx-4 sm:mx-6"
                        onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="username"
                            className="bg-[#f3f3f3] grow min-w-0 mt-4 px-2 py-2 rounded-lg border border-[#aaa]"
                            value={userName ?? ""}
                            onChange={(e) => {
                                setUserName(e.target.value)
                                setError('')
                            }}
                        />
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
                        {error && <p className="error">{error}</p>}
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