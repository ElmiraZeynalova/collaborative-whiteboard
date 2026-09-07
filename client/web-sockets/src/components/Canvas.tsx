import {useRef, useEffect} from 'react'
import { useCanvasStore } from '../store/canvasStore';


export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const setCanvas = useCanvasStore(state => state.setCanvas)
    const pushToUndo = useCanvasStore(state => state.pushToUndo)

    useEffect(() => {
        const canvas = canvasRef.current
        if(!canvas) return 
        setCanvas(canvas)
    }, [])

    function mouseDownHandler(){
        const canvas = canvasRef.current
        if(!canvas) return 
        pushToUndo(canvas.toDataURL())
    }

    return(
        <div className="bg-[#f3f3f3] py-4 grid place-items-center">
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={900} height={550} className="border-2 border-[#aaa] bg-white"></canvas>
        </div>
    )
}