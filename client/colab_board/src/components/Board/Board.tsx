import Canvas from "../Canvas/Canvas"
import BoardBottomSection from './BoardBottomSection'
import {useEffect, useState, useRef} from 'react'
import Modal from "../Modal"
import { useClientStore } from "../../store/clientStore"
import {useHocuspocusProvider } from '@hocuspocus/provider-react'
import BoardTopSection from "./BoardTopSection"
import { useCanvasYjs } from "../../hooks/useCanvasYjs"
import { useParams, useNavigate } from "react-router-dom"
import {IndexeddbPersistence} from 'y-indexeddb'
import { useAuthState } from "../../context/AuthContext"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { joinBoard, getBoardMember } from "../../api/boards"
import axios from 'axios'

export function generateColor() {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`
}

export default function Board(){
    const [showNameModal, setShowNameModal] = useState<boolean>(false)
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
    const {loggedIn} = useAuthState()
    const userRole = useClientStore(state => state.userRole)
    const userId = useClientStore(state => state.userId)
    const setUserRole = useClientStore(state => state.setUserRole)
    const setUserColor = useClientStore(state => state.setUserColor)
    const userColor = useClientStore(state => state.userColor)

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
        enabled: loggedIn && userId !== null && !!id,
    })

    useEffect(() => {
        if(!loggedIn || userId === null || !id || query.isPending || query.isError) return

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

        setUserName(member.name)
        setUserRole(member.role)
        setUserColor(member.color)
     
    }, [query.data, userId, loggedIn, id, query.isPending, query.isError])


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
            }
        }

        handleYjsChange()

        yBoard.observe(handleYjsChange)

        return () => {
            yBoard.unobserve(handleYjsChange)
        }
    }, [yBoard, id, setBoardName, setBoardId])


    useEffect(() => {
        if (!userName || !userRole || !userId || !userColor) return

        provider.setAwarenessField('user', {
            role: userRole,
            name: userName,
            color: userColor,
            userId
         
        })
        

        provider.sendStateless(JSON.stringify({type: 'connection', content: `${userName} entered the room`}))
        
    }, [provider, userName, userRole, userId, userColor])

    return(
        <>
            {showNameModal && <UserNameModal showModal={showNameModal} setShowModal={setShowNameModal} />}
            {isBanned && <BanModal showModal={isBanned} />}
            <div>
                <BoardTopSection/>
                <Canvas/>
                <BoardBottomSection/>
            </div>
        </>
    )
}


function UserNameModal({showModal, setShowModal}: {showModal: boolean, setShowModal: (state: boolean) => void}){
    const {loggedIn} = useAuthState()
    const navigate = useNavigate()
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserRole = useClientStore(state => state.setUserRole)
    const queryClient = useQueryClient()
    const boardId = useClientStore(state => state.boardId)
    const setUserColor = useClientStore(state => state.setUserColor)

    const joinBoardMutation = useMutation({
        mutationFn: async ({ boardId, userName, color }: { boardId: string, userName: string, color: string }) => {
            return joinBoard(boardId, userName, color)
        },
        onSuccess: (entry) => {
            setShowModal(false)
            setUserName(entry.name)
            setUserRole(entry.role)
            setUserColor(entry.color)
            queryClient.setQueryData(['getBoardMember'], entry)
            
        },
        onError: (err) => console.error(err),
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const name = userNameRef.current?.value.trim()

        if (!name || !boardId) return

        const color =  generateColor()

        joinBoardMutation.mutateAsync({
            boardId,
            userName: name,
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
                        {!loggedIn && <><p className="text-center mt-2">or</p>
                        <button 
                            type="button"
                            onClick={() => navigate('/login', {
                                state: {
                                    from: {
                                        pathname: location.pathname,
                                        search: location.search,
                                        hash: location.hash
                                    }
                                }
                            })}
                            className="cursor-pointer text-[#6e6e6e] hover:text-black font-medium mt-2"
                        >Login</button></>}
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
                <Modal.Content>
                    <div className="flex flex-col gap-2">
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
                    </div>
                </Modal.Content>
            </Modal.Container>
        </Modal>
    )
}