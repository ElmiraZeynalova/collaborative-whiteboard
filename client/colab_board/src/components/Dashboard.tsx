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
import Modal from "./Modal"

export default function Dashboard(){
    const navigate = useNavigate()
    const location = useLocation()
    const {loggedIn} = useAuthState()
    const [rerender, forceRerender] = useState<number>(0)
    const queryClient = useQueryClient()
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null)

    const { data: serverBoards = [] } = useQuery({
        queryKey: ['getUserBoards'],
        queryFn: getAllUsersBoards,
        enabled: loggedIn,
    })

    const logoutMutation = useMutation({
        mutationFn: async() => {
            await logout()
        },
        onSuccess: () => {
            localStorage.removeItem("accessToken")
            queryClient.setQueryData(['session'], null);
        },
        onError: (err) => console.log(err)
    })

    const deleteBoardMutation = useMutation({
        mutationFn: async(boardId: string) =>{
            await deleteBoard(boardId)
        },
        onSuccess: async() => {
            setBoardToDelete(null)
            queryClient.invalidateQueries({
                queryKey: ['getUserBoards'],
            })
        },
    })

    const localBoards = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('boards') ?? '[]') ?? []
        } catch {
            return []
        }
    }, [rerender])

    async function handleDeleteBoard(boardId: string){

        const inLocalState = localBoards.find((b: Board) => b.id === boardId)

        if(!inLocalState){
            await deleteBoardMutation.mutateAsync(boardId)
            await deleteLocalBoardDB(boardId)
            return
        }
        const existingBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
        const updatedBoards = existingBoards.length > 0 ? existingBoards.filter((b:Board) => b.id !== boardId) : []
        localStorage.setItem("boards", JSON.stringify(updatedBoards)) 
        await deleteLocalBoardDB(boardId)
        forceRerender((prev) => prev + 1)
    }

    const boards: Board[] = loggedIn ? [...serverBoards, ...localBoards] : localBoards

    return (
        <>
            {boardToDelete && <DeleteBoardModal showModal={boardToDelete ? true : false} setShowModal={() => setBoardToDelete(null)} deleteBoard={() => handleDeleteBoard(boardToDelete)}/>}
            <div className="flex justify-center min-h-dvh bg-[#f3f3f3] w-full px-4">
                <div className="flex flex-col gap-2 w-full max-w-md">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-10 mt-20 sm:mt-40">
                        Collaborative Whiteboard
                    </h1>
                    {loggedIn ? (
                        <div className="flex justify-end gap-2">
                            <p>You're logged in.</p>
                            <button onClick={() => logoutMutation.mutateAsync()} className="cursor-pointer text-[#919191] hover:text-black font-medium">
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
                        {boards && boards.length > 0 && <UserBoards boards={boards} setBoardToDelete={setBoardToDelete} deleteBoard={handleDeleteBoard}/>}
                    </div>
                </div>
            </div>
        </>
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
            const existingBoards = JSON.parse(localStorage.getItem('boards') ?? '[]') 
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



function UserBoards({boards, setBoardToDelete, deleteBoard}: { boards: Board[], setBoardToDelete: (boardId: string) => void, deleteBoard: (id: string) => void}){
    const navigate = useNavigate()
    const {loggedIn} = useAuthState()

    function handleDeleteBoard(board: Board){
        if((board.userRole === "owner") || !loggedIn){
            setBoardToDelete(board.id)
            return
        } 

        deleteBoard(board.id)
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
                            onClick={() => handleDeleteBoard(board)}>
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


function DeleteBoardModal({showModal, setShowModal, deleteBoard}: {showModal: boolean, setShowModal: () => void, deleteBoard: () => void}){
    const {loggedIn} = useAuthState()
    return(
        <Modal open={showModal} closeModal={setShowModal}>
            <Modal.Overlay />
            <Modal.Container>
                <Modal.Header className="text-center text-lg font-medium">Delete board ?</Modal.Header>
                <Modal.Content className="flex flex-col gap-2">
                    {loggedIn 
                        ? <p className="text-center">You're owner of this board. <br/> Are you sure you want to permanently delete it?</p>
                        : <p className="text-center">Are you sure you want to permanently delete this board?</p>
                    }
                    <button 
                        type="button"
                        onClick={deleteBoard}
                        className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                    >Delete board</button>
                    <button 
                        type="button"
                        onClick={setShowModal}
                        className="cursor-pointer hover:bg-mauve-600 bg-gray-100 hover:text-white text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                    >Cancel</button>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}