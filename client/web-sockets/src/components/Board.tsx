import ToolBar from "./ToolBar"
import SettingsBar from "./SettingsBar"
import Canvas from "./Canvas"
import { useParams } from "react-router-dom"
import {useEffect, useState, useRef} from 'react'
import Modal from "./Modal"
import { useClientStore } from "../store/clientStore"
import { handleMessage } from "../utils/messageHandler"
import { useCanvasStore } from "../store/canvasStore"
import CanvasRenderer from "../canvas/CanvasRenderer"

export default function Board(){
    const {id} = useParams()
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const [showModal, setShowModal] = useState(true)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserId = useClientStore(state => state.setUserId)
    const userName = useClientStore(state => state.userName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const setWS = useClientStore(state => state.setWS)
    const canvas = useCanvasStore(state => state.canvas)
    const canvasRerendererRef = useRef<CanvasRenderer | null>(null)
    const shapes = useCanvasStore(state => state.shapes)
    const undoStack = useCanvasStore(state => state.undoStack)

    console.log( "shapes: ", Object.entries(shapes))
    console.log("undo: ", undoStack)
    useEffect(() => {
        if(userName){
            const ws = new WebSocket("ws://localhost:3000")

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "connection", boardId: id, userName: userName }))
                setBoardId(id!)
                setWS(ws)
            }

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data)
                handleMessage(message)
            }

            return () => ws.close()
        }
    }, [userName, id]);

    useEffect(() => {
        if(!canvas) return
        canvasRerendererRef.current = new CanvasRenderer(canvas) 
    }, [canvas])

    useEffect(() => {
        if(!canvasRerendererRef.current) return
        canvasRerendererRef.current.rerender()
    }, [shapes])

    function handleClick(){
        if(!userNameRef.current) return 
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
                        <input 
                            type="text" 
                            placeholder="Username..." 
                            className="bg-white my-4 px-3 py-2 rounded-lg w-full border border-[#aaa]"
                            ref={userNameRef}/>
                        <button 
                            onClick={handleClick}
                            className="cursor-pointer bg-mauve-600 hover:bg-gray-100 text-white hover:text-black hover:border-2 hover:border-black border-2 font-medium w-full rounded-lg px-3 py-2"
                        >Enter</button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <div className="flex flex-col m-0 p-0 w-screen h-screen">
                <ToolBar/>
                <SettingsBar/>
                <Canvas/>
            </div>
        </>
    )
}