import { useClientStore } from "../store/clientStore"
import { useNavigate, useLocation } from "react-router-dom"
import { logout } from "../api/auth"
import { useAuthState } from "../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createServerBoard, createLocalBoard, getAllUsersBoards, deleteLocalBoard, deleteServerBoard } from "../api/boards"
import type { Board, BoardType } from "../types/board"
import { useEffect, useMemo, useState } from "react"
import { Icon } from '@iconify/react'
import { deleteLocalBoardFromIDB } from "../utils/iDBOperations"
import Modal from "./Modal"
import { saveBoardToLocalStorage, deleteBoardFromLocalStorage } from "../utils/localStorageOperations"
//import {useHocuspocusProvider } from '@hocuspocus/provider-react'

export default function Dashboard(){
    const navigate = useNavigate()
    const location = useLocation()
    const {loggedIn} = useAuthState()
    const [rerender, forceRerender] = useState<number>(0)
    const queryClient = useQueryClient()
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null)
    const boardName = useClientStore(state => state.boardName)

    const { data: serverBoards = [] } = useQuery({
        queryKey: ['getUserBoards'],
        queryFn: getAllUsersBoards,
        enabled: loggedIn === true,
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

    const localBoards = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('boards') ?? '[]') ?? []
        } catch {
            return []
        }
    }, [rerender])

    
    const deleteBoardMutation = useMutation({
        mutationFn: async(boardId: string) =>{ 
            const inLocalState = localBoards.find((b: Board) => b.id === boardId)
            const board = inLocalState 
                ? await deleteLocalBoard(boardId)
                : await deleteServerBoard(boardId)
            return board
        },
        onSuccess: async(board) => {
            console.log(board)
            setBoardToDelete(null)
            queryClient.invalidateQueries({
                queryKey: ['getUserBoards'],
            })
        },
    })

    const boards: Board[] = loggedIn ? [...serverBoards, ...localBoards] : localBoards

    const boardsToShow = useMemo(() => {
        if (!boardName) return boards
        const query = boardName.trim().toLowerCase()

        if (!query) return boards

        return boards.filter(board =>
            board.name.toLowerCase().includes(query)
        )
    }, [boards, boardName])

    async function handleDeleteBoard(boardId: string){

        const inLocalState = localBoards.find((b: Board) => b.id === boardId)

        await deleteBoardMutation.mutateAsync(boardId)

        if(inLocalState){
            deleteBoardFromLocalStorage(boardId)
        }

        await deleteLocalBoardFromIDB(boardId)
        forceRerender((prev) => prev + 1)
    }

    return (
        <>
            {boardToDelete && <DeleteBoardModal showModal={boardToDelete ? true : false} setShowModal={() => setBoardToDelete(null)} deleteBoard={() => handleDeleteBoard(boardToDelete)} isPending={deleteBoardMutation.isPending}/>}
            <div className="flex justify-center min-h-dvh bg-[#f3f3f3] w-full px-4">
                <div className="flex flex-col gap-2 w-full max-w-md">
                    <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-10 mt-20 sm:mt-40">
                        Collaborative Whiteboard
                    </h1>
                    {loggedIn === true ? (
                        <div className="flex justify-end gap-2">
                            <p>You're logged in.</p>
                            <button onClick={() => logoutMutation.mutate()} className="cursor-pointer text-[#919191] hover:text-black font-medium">
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
                        {boards && boards.length > 0 && <UserBoards boards={boardsToShow} setBoardToDelete={setBoardToDelete} deleteBoard={handleDeleteBoard} localBoards={localBoards}/>}
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

    useEffect(() => {
        setBoardName(null)
    }, [])

    const createBoardMutation = useMutation({
        mutationFn: async(data: {id: string, name: string, type: BoardType} ) => {
            if(!data.name || !data.id || !data.type) return

            const board = loggedIn === true
                ? await createServerBoard({id: data.id, name: data.name, type: data.type})
                : await createLocalBoard({id: data.id, name: data.name, type: data.type})
            return board
        },
        onSuccess: (board) => {
            console.log(board)
        },
        onError: (err) => console.log(err)
    })

    
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const name = boardName?.trim()

        if (!name || loggedIn === "loading") return

        const id = crypto.randomUUID()
        const type: BoardType = loggedIn === true ? "server" : "local"

        try {
            await createBoardMutation.mutateAsync({ id, name, type })

            if (type === "local") {
                saveBoardToLocalStorage(id, name)
                navigate(`/boards/local/${id}`)
            } else {
                navigate(`/boards/${id}`)
            }

            setBoardId(id)
        } catch (error) {
            console.error("Failed to create board:", error)
        }
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

function UserBoards({boards, setBoardToDelete, deleteBoard, localBoards}: { boards: Board[], setBoardToDelete: (boardId: string) => void, deleteBoard: (id: string) => void, localBoards: Board[] }){
    const navigate = useNavigate()
    const {loggedIn} = useAuthState()

    function handleDeleteBoard(board: Board){
        if((board.userRole === "owner") || loggedIn === false){
            setBoardToDelete(board.id)
            return
        } 

        deleteBoard(board.id)
    }

    function handleBoardChoice(boardId: string){
        const inLocalState = localBoards.find((b: Board) => b.id === boardId)

        inLocalState ? navigate(`/boards/local/${boardId}`) : navigate(`/boards/${boardId}`) 
    }

    if(!boards) return null

    return(
        <section 
            className="flex flex-col mx-4 sm:mx-6">
            <p>Your boards:</p>
            <div
                className="flex flex-col items-start">
                {boards.map((board) => {
                    if(!board) return null
                    return (
                        <div
                            key={board.id}
                            className="group flex gap-2 items-center">
                            <button
                                onClick={() => handleBoardChoice(board.id)}
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
                    )
                })}
            </div>
        </section>
    )
}


function DeleteBoardModal({showModal, setShowModal, deleteBoard, isPending}: {showModal: boolean, setShowModal: () => void, deleteBoard: () => void, isPending: boolean}){
    const {loggedIn} = useAuthState()
    return(
        <Modal open={showModal} closeModal={() => setShowModal()}>
            <Modal.Overlay />
            <Modal.Container>
                <Modal.Header className="text-center text-lg font-medium">Delete board ?</Modal.Header>
                <Modal.Content className="flex flex-col gap-2">
                    {loggedIn === true
                        ? <p className="text-center">You're owner of this board. <br/> Are you sure you want to permanently delete it?</p>
                        : <p className="text-center">Are you sure you want to permanently delete this board?</p>
                    }
                    <button 
                        type="button"
                        onClick={deleteBoard}
                        className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                    >{isPending ? "Deleting board..." : "Delete board"}</button>
                    <button 
                        type="button"
                        onClick={setShowModal}
                        className="cursor-pointer hover:bg-mauve-600 bg-gray-100 hover:text-white text-black hover:border-white border-black border-2 font-medium rounded-lg px-3 py-2"
                    >Cancel</button>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}