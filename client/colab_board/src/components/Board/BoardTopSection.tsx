import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Modal from '../Modal'
import SideBar from './SideBar'
import { useClientStore } from '../../store/clientStore'
import { useMutation } from '@tanstack/react-query'
import {changeBoardName} from '../../api/boards'
import { useCanvasYjs } from '../../hooks/useCanvasYjs'
import type { Board } from '../../types/board'
import { useAuthState } from '../../context/AuthContext'

export default function BoardTopSection(){
    const boardName = useClientStore(state => state.boardName)
    const setBoardName = useClientStore(state => state.setBoardName)
    const boardId = useClientStore(state => state.boardId)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [showUsersSideBar, setShowUsersSideBar] = useState(false)
    const timerRef = useRef<number | undefined>(undefined)
    const {yBoard} = useCanvasYjs()
    const {loggedIn} = useAuthState()
    const userRole = useClientStore(state => state.userRole)
    const [newBoardName, setNewBoardName] = useState<string | null>(null)

    function updateBoardNameLocaly(boardName: string){
        yBoard.set("name", boardName)
        const localBoards = JSON.parse(localStorage.getItem("boards") ?? "[]") ?? []
        if(localBoards.length === 0) return
        const updatedBoards = localBoards.map((board: Board) => {
            return board.id === boardId ? {id: board.id, name: boardName} : board
        })
        localStorage.setItem("boards", JSON.stringify(updatedBoards))
    }

    const changeBoardNameMutation = useMutation({
        mutationFn: async(newBoardName: string) => {
            if(newBoardName === null || newBoardName.trim().length === 0) return
            const board = await changeBoardName(boardId!, newBoardName)
            return board
        },
        onSuccess: (board) => {
            yBoard.set("name", board.name)
            setBoardName(board.name)
        },
        onError: (err) => console.log(err)
    })
    
    async function handleClick(){
        await navigator.clipboard.writeText(`${window.location.origin}/boards/${boardId}`)
        setShowMessage(true)
    }

    useEffect(() => {
        if(!newBoardName) return
        console.log(newBoardName)
        timerRef.current = setTimeout(() => {
            loggedIn ? changeBoardNameMutation.mutateAsync(newBoardName) : updateBoardNameLocaly(boardName!)
        }, 5000)
        return () => {
            clearTimeout(timerRef.current)
        }
    }, [newBoardName])

    return(
        <>
            <Modal 
                open={showModal} 
                closeModal={() => {
                    setShowModal(false)
                    setShowMessage(false)
                }
                }>
                <Modal.Overlay/>
                <Modal.Container>
                    <Modal.Header className="flex gap-10 items-center">
                        <p className="text-lg font-normal m-1">Share board link with friends</p>
                        <button 
                            className="cursor-pointer"
                            onClick={() => {
                                setShowModal(false)
                                setShowMessage(false)
                            }
                        }><Icon icon="radix-icons:cross-2" width={22} height={22} color="#919191" /></button>
                    </Modal.Header>
                    <Modal.Content className="flex flex-col items-start gap-2 mx-1 mt-2">
                            <button 
                                onClick={handleClick}
                                type="button"
                                className="cursor-pointer my-2 w-full bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-normal text-md rounded-lg py-1.5"
                            >Copy board link</button>
                            {showMessage && <p>Link copied to clipboard</p>}
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <div className="absolute top-2 left-3 right-3 z-10 flex items-center justify-between gap-2">
                <button 
                    onClick={() => {
                        setBoardName(null)
                        navigate('/')
                    }}
                    className="cursor-pointer px-3 py-2 flex items-center justify-center gap-1 rounded-lg drop-shadow-md bg-white border border-black/15">
                    <Icon icon="gg:arrow-left" width={20} height={20} />
                    Dashboard
                </button>
            
                <div className="px-3 py-2 flex items-center gap-4 rounded-lg drop-shadow-md bg-white border border-black/15">
                    {userRole !== "contributor" ? <input
                        value={newBoardName ?? boardName ?? ""}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        className="outline-none p-0 m-0 text-center"
                        size={Math.max(boardName?.length ?? 0, 1)}

                    />
                    : <p>{boardName}</p>}
                    <button 
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer border-l border-black/15 pl-3">Share link</button>
                </div>
                <button 
                    onClick={() => setShowUsersSideBar(true)}
                    className="cursor-pointer px-2.5 py-2.5 flex items-center gap-4 rounded-lg drop-shadow-md bg-white border border-black/15">
                        <Icon icon="lucide:users" width={20} height={20} />
                </button>
            </div>
            
            {showUsersSideBar && 
                <>
                    <div className="fixed z-11 inset-0 bg-black/55" onClick={() => setShowUsersSideBar(false)}/>
                    <SideBar closeBar={() => setShowUsersSideBar(false)}/>
                </>
            }
        </>
    )
}