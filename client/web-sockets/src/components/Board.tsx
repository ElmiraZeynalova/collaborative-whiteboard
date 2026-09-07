import ToolBar from "./ToolBar"
import SettingsBar from "./SettingsBar"
import Canvas from "./Canvas"
import { useParams } from "react-router-dom"
import {useEffect, useState} from 'react'
import Modal from "./Modal"
import { useCanvasStore } from "../store/canvasStore"
import Brush from "../tools/Brush"

export default function Board(){
    const {id} = useParams()
    const [name, setName] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(true)
    const setUserName = useCanvasStore(state => state.setUserName)
    const userName = useCanvasStore(state => state.userName)
    const setBoardId = useCanvasStore(state => state.setBoardId)
    const setWS = useCanvasStore(state => state.setWS)
    const canvas = useCanvasStore(state => state.canvas)

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
                if(message.type === "connection"){
                    console.log(message.content)
                }else if(message.type.startsWith("draw:")){
                    handleDrawing(message)
                }      
            }

            return () => ws.close()
        }

    }, [userName, id]);

    function handleDrawing(message: { type: string, boardId: string, shape: string, x?: number, y?: number}){
        const ctx =  canvas?.getContext('2d')
        if(!ctx) return

        switch(message.type){
            case "draw:start":
                if(message.x === undefined || message.y === undefined) return
                startShape(ctx, message.shape, message.x, message.y)
                break
            case "draw:move":
                if(message.x === undefined || message.y === undefined) return
                moveShape(ctx, message.shape, message.x, message.y)
                break
            case "draw:end":
                ctx.beginPath()
                break
        }
    }

    function startShape(ctx: CanvasRenderingContext2D, shape: string, x: number, y: number){
        switch(shape){
            case "brush":
                Brush.start(ctx, x, y)
                break
            }
    }

    function moveShape(ctx: CanvasRenderingContext2D, shape: string, x: number, y: number){
        switch(shape){
            case "brush":
                Brush.draw(ctx, x, y)
                break
            }
    }

    function handleClick(){
        if(!name) return 
        setShowModal(false)
        setUserName(name)
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
                            value={name ?? ""} 
                            onChange={(e) => setName(e.target.value)}/>
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