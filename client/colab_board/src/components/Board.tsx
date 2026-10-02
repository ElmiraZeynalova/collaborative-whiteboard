import Canvas from "./Canvas/Canvas"
import BoardBottomSection from './BoardBottomSection'
import {useEffect, useState, useRef} from 'react'
import Modal from "./Modal"
import { useClientStore } from "../store/clientStore"
import {useHocuspocusProvider } from '@hocuspocus/provider-react'
import BoardTopSection from "./BoardTopSection"

function generateColor() {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`
}

export default function Board(){
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const [showModal, setShowModal] = useState(true)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserId = useClientStore(state => state.setUserId)
    const userName = useClientStore(state => state.userName)
    const provider = useHocuspocusProvider()

    useEffect(() => {
        if (!userName) return
        provider.sendStateless(`${userName} entered the room`)
        provider.setAwarenessField("user", {
            name: userName,
            color: generateColor()
        });
    }, [provider, userName])

    function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if(!userNameRef.current || userNameRef.current.value === "") return 
        setShowModal(false)
        setUserName(userNameRef.current.value)
        setUserId(crypto.randomUUID())
    }

    return(
        <>
            <Modal open={showModal} closeModal={() => setShowModal(false)}>
                <Modal.Overlay/>
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
            <div>
                <BoardTopSection/>
                <Canvas/>
                <BoardBottomSection/>
            </div>
        </>
    )
}
