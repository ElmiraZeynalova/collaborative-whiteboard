import Canvas from "../Canvas/Canvas"
import BoardBottomSection from './BoardBottomSection'
import {useEffect, useState, useRef} from 'react'
import Modal from "../Modal"
import { useClientStore } from "../../store/clientStore"
import {useHocuspocusProvider } from '@hocuspocus/provider-react'
import BoardTopSection from "./BoardTopSection"
import { useCanvasYjs } from "../../hooks/useCanvasYjs"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {IndexeddbPersistence} from 'y-indexeddb'
import { useAuthState } from "../../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { joinBoard, getBoardMember, getLocalBoard } from "../../api/boards"
import axios from 'axios'
import { deleteBoardFromLocalStorage, saveBoardToLocalStorage, updateBoardNameInLocalStorage } from "../../utils/localStorageOperations"
import { deleteLocalBoardFromIDB } from "../../utils/iDBOperations"
import type { Mode } from "../../store/clientStore"

export function generateColor() {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`
}

type MemberToJoin = {
    board_id: string
    name?: string
    color?: string
    is_hidden?: boolean
}

export default function Board({mode}: {mode: Mode}){
    const setBoardMode = useClientStore(state => state.setBoardMode)
    const [showNameModal, setShowNameModal] = useState<boolean>(false)
   // const [showLocalBoardDeletedModal, setShowLocalBoardDeletedModal] = useState<boolean>(false)
    const isBanned = useClientStore(state => state.isBanned)
    const setIsBanned = useClientStore(state => state.setIsBanned)
    const userName = useClientStore(state => state.userName)
    const setUserName = useClientStore(state => state.setUserName)
    const provider = useHocuspocusProvider()
    const boardName = useClientStore(state => state.boardName)
    const setBoardName = useClientStore(state => state.setBoardName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const { id } = useParams()
    const { yBoard, ydoc } = useCanvasYjs()
    const { loggedIn } = useAuthState()
    const userId = useClientStore(state => state.userId)
    const setUserRole = useClientStore(state => state.setUserRole)
    const setUserColor = useClientStore(state => state.setUserColor)
    const userColor = useClientStore(state => state.userColor)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation();
    const deletedBoardId = useClientStore(state => state.deletedBoardId)
    const setDeletedBoardId = useClientStore(state => state.setDeletedBoardId)

    useEffect(() => {
        setBoardMode(mode)
    }, [mode, setBoardMode, id])

    useEffect(() => {
        if (loggedIn === false && mode === "server") {
            navigate("/login", {
                replace: true,
                state: {
                    from: location,
                },
            });
        }
    }, [loggedIn, navigate, location])

    const localBoardQuery = useQuery({
        queryKey: ['getLocalBoard', id],
        queryFn: async() => {
            if(!id) return undefined
            try {
                return await getLocalBoard(id)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    return null;
                }
                throw error;
            }
        },
        enabled: !!id && mode === "local",
    })

    useEffect(() => {
        if(localBoardQuery.isPending) return
        if(!localBoardQuery.data){
            setDeletedBoardId(id!)
            return
        }
        updateBoardNameInLocalStorage(id!,localBoardQuery.data.name)
    }, [localBoardQuery.isPending, localBoardQuery.data])

    const query = useQuery({
        queryKey: ['getBoardMember', id, userId],
        queryFn: async() => {
            if (!id || !userId) return undefined;
            try {
                return await getBoardMember(id, userId)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 400) {
                    return null;
                }
                throw error;
            }
        },
        enabled: loggedIn === true && userId !== null && !!id && mode === "server",
    })

    const joinBoardMutation = useMutation({
        mutationFn: async (member: MemberToJoin) => {
            return joinBoard(member)
        },
        onSuccess: (entry) => {
            if(showNameModal) setShowNameModal(false)
            setUserName(entry.name)
            setUserRole(entry.role)
            setUserColor(entry.color)
            queryClient.setQueryData(['getBoardMember'], entry)
            
        },
        onError: (err) => console.error(err),
    })


    useEffect(() => {
        if(mode === "local"){
            const existingUserData = JSON.parse(localStorage.getItem("user") ?? "{}") ?? {}
            if(!existingUserData || !existingUserData.name || !existingUserData.color){
                setShowNameModal(true)
            }else{
                setUserName(existingUserData.name)
                setUserColor(existingUserData.color)
            }
            return
        }

        if(loggedIn !== true || userId === null || !id || query.isPending || query.isError) return

        const member = query.data

        if(member === undefined) return

        if(member === null){
            setShowNameModal(true)
            return
        }

        if(!member.access){
            setIsBanned(true)
            return
        }
        
        if(member.name === null){
            setShowNameModal(true)
            return
        }

        if(member.is_hidden){
            joinBoardMutation.mutate({board_id: id, is_hidden: false})
            return
        }

        setUserName(member.name)
        setUserRole(member.role)
        setUserColor(member.color)
     
    }, [query.data, userId, loggedIn, id, query.isPending, query.isError, query.isEnabled])


    useEffect(() => {
        if (!id) return

        const indexeddbProvider = new IndexeddbPersistence(id, ydoc)

        indexeddbProvider.whenSynced.then(() => {
            console.log('IndexedDB synced')
        })

        return () => {
            indexeddbProvider.destroy()
        }
    }, [id, ydoc])


    useEffect(() => {
        if (!yBoard.has('name') && boardName) {
            yBoard.set('name', boardName)
        }
    }, [yBoard])


    useEffect(() => {
        const handleYjsChange = () => {
            const name = yBoard.get("name")
         
            if (typeof name === "string" && id) {
                setBoardName(name)
                setBoardId(id)
                if(mode === "local") saveBoardToLocalStorage(id, name)
            }
        }

        handleYjsChange()

        yBoard.observe(handleYjsChange)

        return () => {
            yBoard.unobserve(handleYjsChange)
        }
    }, [yBoard, id, setBoardName, setBoardId])


    useEffect(() => {
        if(!userName) return 

        if(mode === "local" && userColor && userName){
            provider.setAwarenessField('user', {
                color: userColor,
                name: userName
            })
        }

        if (userId && userColor && mode === "server"){
            provider.setAwarenessField('user', {
                color: userColor,
                userId
            })
        }

        provider.sendStateless(JSON.stringify({type: 'connection'}))
        
    }, [provider, userId, userName, userColor])


    return(
        <>
            {showNameModal && <UserNameModal showModal={showNameModal} setShowModal={setShowNameModal} joinBoardMutation={(data: MemberToJoin) => joinBoardMutation.mutate(data)}/>}
            {isBanned && <BanModal showModal={isBanned} />}
            {deletedBoardId === id && 
                <LocalBoardDeletedModal 
                    showModal={deletedBoardId === id} 
                    handleLocalBoardDeletion={() => {
                        if(mode === "local") deleteBoardFromLocalStorage(id!)
                        deleteLocalBoardFromIDB(id!)
                    }}
                />
            }
            <div>
                <BoardTopSection />
                <Canvas/>
                <BoardBottomSection/>
            </div>
        </>
    )
}


function UserNameModal({showModal, setShowModal, joinBoardMutation}: { showModal: boolean, setShowModal: (state: boolean) => void, joinBoardMutation: (data: MemberToJoin) => void}){
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const boardId = useClientStore(state => state.boardId)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserColor = useClientStore(state => state.setUserColor)
    const mode = useClientStore(state => state.boardMode)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const name = userNameRef.current?.value.trim()
        console.log(name, boardId)
        if (!name || !boardId) return

        const color = generateColor()

        if(mode === "local"){
            localStorage.setItem("user", JSON.stringify({name, color}))
            setUserName(name)
            setUserColor(color)
            setShowModal(false)
            return
        }

        joinBoardMutation({
            board_id: boardId,
            name: name,
            color: color
        })
    }
    
    return(
        <Modal open={showModal} closeModal={() => setShowModal(false)}>
            <Modal.Overlay />
            <Modal.Container>
                <Modal.Header className="text-center text-lg font-medium">Type in your username to enter the room</Modal.Header>
                <Modal.Content>
                    <form 
                        className="flex flex-col w-full"
                        onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Username..." 
                            className="bg-white my-4 px-3 py-2 rounded-lg border border-[#aaa]"
                            ref={userNameRef}/>
                        <button 
                            type="submit"
                            className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                        >Enter</button>
                    </form>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}


function BanModal({showModal}: {showModal: boolean}){
    const navigate = useNavigate()
    const setBoardName = useClientStore(state => state.setBoardName)

    return(
        <Modal open={showModal} closeModal={() => {}}>
            <Modal.Overlay />
            <Modal.Container>
                <Modal.Header className="text-center text-lg font-medium mb-2">Access denied</Modal.Header>
                <Modal.Content className="flex flex-col gap-2">        
                    <p className="text-lg">You don't have permission to access this board</p>
                    <button
                        className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                        onClick={() => {
                            setBoardName(null)
                            navigate("/")}}>Back to dashboard
                    </button>
                    <button
                        className="cursor-pointer hover:bg-mauve-600 bg-gray-100 hover:text-white text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                        onClick={() => window.location.reload()}>Recheck access
                    </button>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}


function LocalBoardDeletedModal({showModal, handleLocalBoardDeletion}: {showModal: boolean, handleLocalBoardDeletion: () => void}){
    const navigate = useNavigate()
    const setBoardName = useClientStore(state => state.setBoardName)

    return(
        <Modal open={showModal} closeModal={() => {}}>
            <Modal.Overlay />
            <Modal.Container>
                <Modal.Header className="text-center text-lg font-medium mb-2">Access denied</Modal.Header>
                <Modal.Content className="flex flex-col gap-2">
                    <p className="text-md">This board was deleted</p>
                    <button
                        className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium rounded-lg px-3 py-2"
                        onClick={() => {
                            handleLocalBoardDeletion()
                            setBoardName(null)
                            navigate("/")}}>Back to dashboard
                    </button>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}