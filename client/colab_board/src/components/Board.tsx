import ToolBar from "./ToolBar"
import SettingsBar from "./SettingsBar/SettingsBar"
import Canvas from "./Canvas"
import Selection from "../canvas/tools/Selection"
import { useParams } from "react-router-dom"
import {useEffect, useState, useRef} from 'react'
import Modal from "./Modal"
import { useClientStore } from "../store/clientStore"
import { handleMessage } from "../utils/messageHandler"
import { useToolStore } from "../store/toolStore"
import UndoRedoBar from "./UndoRedoBar"
import { useCanvasStore } from "../store/canvasStore"

export default function Board(){
    const {id} = useParams()
    const userNameRef = useRef<HTMLInputElement | null>(null)
    const [showModal, setShowModal] = useState(true)
    const setUserName = useClientStore(state => state.setUserName)
    const setUserId = useClientStore(state => state.setUserId)
    const userName = useClientStore(state => state.userName)
    const setBoardId = useClientStore(state => state.setBoardId)
    const setWS = useClientStore(state => state.setWS)
    const setTool = useToolStore(state => state.setTool)
    const tool = useToolStore(state => state.tool)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)

    useEffect(() => {
        if(userName){
            const ws = new WebSocket("ws://localhost:3000")

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "connection", boardId: id, userName: userName }))
                setBoardId(id!)
                setWS(ws)
                setTool(new Selection())
            }

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data)
                handleMessage(message)
            }

            return () => ws.close()
        }
    }, [userName, id]);


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
                <Canvas/>
                <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between gap-2">
                    <div className="flex-1" />
                    <ToolBar/>
                    <div className="flex-1 flex justify-end">
                        <UndoRedoBar/>
                    </div>
                </div>
                {tool && (tool.type !== 'selection' || selectedShapesIds.length > 0) && <SettingsBar/>}
            </div>
        </>
    )
}
