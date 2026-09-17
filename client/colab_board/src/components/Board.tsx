import ToolBar from "./ToolBar"
import SettingsBar from "./SettingsBar/SettingsBar"
import Canvas from "./Canvas"
import Selection from "../canvas/tools/Selection"
import { useParams } from "react-router-dom"
import {useEffect, useState, useRef} from 'react'
import Modal from "./Modal"
import { useClientStore } from "../store/clientStore"
import { handleMessage } from "../utils/messageHandler"
import { useCanvasStore } from "../store/canvasStore"
import { useToolStore } from "../store/toolStore"
import CanvasRenderer from "../canvas/CanvasRenderer"
import UndoRedoBar from "./UndoRedoBar"

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
    const setTool = useToolStore(state => state.setTool)
    const tool = useToolStore(state => state.tool)
    const selectedShapeId = useCanvasStore(state => state.selectedShapeId)
    const hoveredShapeId = useCanvasStore(state => state.hoveredShapeId)

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

    useEffect(() => {
        if(!canvas) return
        canvasRerendererRef.current = new CanvasRenderer(canvas) 
    }, [canvas])

    useEffect(() => {
        if(!canvasRerendererRef.current) return
        canvasRerendererRef.current.rerender(shapes, selectedShapeId, hoveredShapeId)
    }, [shapes, selectedShapeId, hoveredShapeId])  

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
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                    <div className="flex-1" />
                    <ToolBar/>
                    <div className="flex-1 flex justify-end">
                        <UndoRedoBar/>
                    </div>
                </div>
                {(tool?.type !== 'selection' && tool) && <SettingsBar/>}
            </div>
        </>
    )
}
//если есть селектед шейп при селекшин интрументе то показівать нужній сеттингбар для єдита фигурі