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
import { useMutation } from '@tanstack/react-query'
import { joinBoard } from "../../api/boards"
import { changeUsername } from "../../api/members"

export function generateColor() {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`
}

export default function Board(){
    const [showModal, setShowModal] = useState(() => !localStorage.getItem('user'))
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
    const setUserRole = useClientStore(state => state.setUserRole)
    const userId = useClientStore(state => state.userId)
    const setUserId = useClientStore(state => state.setUserId)

    const addUserToBoardMutation = useMutation({
        mutationFn: async() => {
            if(!id) return
            const entry = await joinBoard(id)
            return entry
        },
        onSuccess: (entry) => {
            setUserId(entry.user_id)
            setUserRole(entry.role)
        },
        onError: (err) => console.log(err)
    })

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
        if (!userName || !userRole || !userId) return

        const storedUser = localStorage.getItem('user')
        if (!storedUser) return

        const user = JSON.parse(storedUser)

        provider.setAwarenessField('user', {
            role: userRole,
            name: user.name,
            color: user.color,
            userId
         
        })

        provider.sendStateless(`${userName} entered the room`)
        
    }, [provider, userName, userRole, userId])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')

        if (!storedUser) return

        const user = JSON.parse(storedUser)

        setUserName(user.name)
        setShowModal(false)
    }, [setUserName])

    useEffect(() => {
        if(!loggedIn) return
        addUserToBoardMutation.mutate()
    }, [id, loggedIn])

    return(
        <>
            {showModal && <UserNameModal showModal={showModal} setShowModal={setShowModal} />}
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

    const changeUsernameMutation = useMutation({
        mutationFn: async(userName: string) => {
            const entry = await changeUsername(userName)
            return entry
        },
        onSuccess: (entry) => {
            console.log(entry)
        },
        onError: (err) => console.log(err)
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const userName = userNameRef.current?.value.trim()

        if (!userName) return

        if(loggedIn) changeUsernameMutation.mutateAsync(userName)
            
        const user = {
            name: userName,
            color: generateColor(),
        }

        localStorage.setItem('user', JSON.stringify(user))

        setUserName(userName)
        setShowModal(false)
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