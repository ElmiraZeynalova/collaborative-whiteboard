import { useClientStore } from "../store/clientStore"
import { useNavigate, useLocation } from "react-router-dom"
import { logout } from "../api/auth"
import { useAuthState } from "../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBoard, getAllUsersBoards, deleteBoard } from "../api/boards"
import type { Board } from "../types/board"
import { useMemo, useState } from "react"
import { Icon } from '@iconify/react'
import { deleteLocalBoardDB } from "../utils/deleteLocalBoardDB"

export default function Dashboard(){
    const navigate = useNavigate()
    const location = useLocation()
    const {loggedIn, setLoggedIn} = useAuthState()
    const [rerender, forceRerender] = useState<number>(0)

    const { data: serverBoards = [] } = useQuery({
        queryKey: ['getUserBoards'],
        queryFn: getAllUsersBoards,
        enabled: loggedIn,
    })

    const localBoards = useMemo(() => {

        try {
            return JSON.parse(localStorage.getItem('boards') ?? '[]') ?? []
        } catch {
            return []
        }
    }, [rerender])

    const boards: Board[] = loggedIn ? [...serverBoards, ...localBoards] : localBoards

    function getStoredUserName(): string | null {
        const storedUser = localStorage.getItem("user")

        if (!storedUser) return null

        try {
            const user = JSON.parse(storedUser)
            return typeof user.name === "string" && user.name.trim()
                ? user.name
                : null
        } catch {
            return null
        }
    }

    async function handleLogOut(){
        await logout()
        localStorage.removeItem("accessToken")
        setLoggedIn(false)
    }

    return (
        <div className="flex justify-center min-h-dvh bg-[#f3f3f3] w-full px-4">
            <div className="flex flex-col gap-2 w-full max-w-md">
                <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-10 mt-20 sm:mt-40">
                    Collaborative Whiteboard
                </h1>
                {loggedIn ? (
                    <div className="flex justify-end gap-2">
                        <p>{getStoredUserName()}</p>
                        <button onClick={handleLogOut} className="cursor-pointer text-[#919191] hover:text-black font-medium">
                            Log out
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login', {
                            state: {
                                from: {
                                    pathname: location.pathname,
                                    search: location.search,
                                    hash: location.hash
                                }
                            }
                        })}
                        className="cursor-pointer text-end text-[#919191]">Log in</button>
                )}
                <div className="flex flex-col bg-white rounded-[18px] py-5 w-full">
                    <h3 className="text-center text-xl font-medium">Find or create board</h3>
                    <BoardForm/>
                    {boards && boards.length > 0 && <UserBoards boards={boards} localBoards={localBoards} updateLocalState={() => forceRerender(prev => prev + 1)}/>}
                </div>
            </div>
        </div>
    )
}

function BoardForm(){
    const boardName = useClientStore(state => state.boardName)
    const setBoardName = useClientStore(state => state.setBoardName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const navigate = useNavigate()
    const {loggedIn} = useAuthState()

    const createBoardMutation = useMutation({
        mutationFn: async(id: string) => {
            if(!boardName || !id) return
            const board = await createBoard({id: id, name: boardName})
            return board
        },
        onSuccess: (board) => {
            console.log(board)
        },
        onError: (err) => console.log(err)
    })

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if(boardName === null || boardName === "") return 

        const id = crypto.randomUUID()
        if (loggedIn) {
            try {
                await createBoardMutation.mutateAsync(id)
            } catch (error) {
                console.error("Failed to create board:", error)
                return
            }
        }else{
            const existingBoards = JSON.parse(localStorage.getItem('boards') ?? '[]') as Board[]
            existingBoards.push({id, name: boardName})
            localStorage.setItem("boards", JSON.stringify(existingBoards))
        }

        setBoardId(id)
        navigate(`/boards/${id}`)
    }

    return(
        <form
            className="flex items-center gap-2 mx-4 sm:mx-6"
            onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Board name..."
                className="bg-[#f3f3f3] grow min-w-0 my-4 px-2 py-2 rounded-lg border border-[#aaa]"
                value={boardName ?? ""}
                onChange={(e) => setBoardName(e.target.value)}
            />
            <button
                type="submit"
                className="shrink-0 cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-black border-2 border-transparent font-medium rounded-lg px-4 py-2"
                disabled={createBoardMutation.isPending}
            >
                {createBoardMutation.isPending ? "Creating..." : "Create"}
            </button>
        </form>
    )
}

function UserBoards({boards, localBoards, updateLocalState}: { boards: Board[], localBoards: Board[], updateLocalState: () => void}){
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const deleteBoardMutation = useMutation({
        mutationFn: deleteBoard,
        onSuccess: async() => {
            queryClient.invalidateQueries({
                queryKey: ['getUserBoards'],
            })
        },
    })

    async function handleDeleteBoard(boardId: string){
        const inLocalState = localBoards.find((b: Board) => b.id === boardId)
        if(!inLocalState){
            deleteBoardMutation.mutateAsync(boardId)
            await deleteLocalBoardDB(boardId)
        }else{
            const existingBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
            const updatedBoards = existingBoards.length > 0 ? existingBoards.filter((b:Board) => b.id !== boardId) : []
            localStorage.setItem("boards", JSON.stringify(updatedBoards)) 
            await deleteLocalBoardDB(boardId)
            updateLocalState()
        }
    }

    return(
        <section 
            className="flex flex-col mx-4 sm:mx-6">
            <p>Your boards:</p>
            <div
                className="flex flex-col items-start">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className="group flex gap-2 items-center"
                    >
                        <button
                            onClick={() => navigate(`/boards/${board.id}`)}
                            className="text-[#919191] hover:text-black font-medium cursor-pointer"
                        >
                            {board.name}
                        </button>

                        <button 
                            className="invisible group-hover:visible cursor-pointer"
                            onClick={() => handleDeleteBoard(board.id)}>
                            <Icon
                                icon="carbon:trash-can"
                                width={16}
                                height={16}
                                className="text-[#919191] hover:text-black"
                            />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}