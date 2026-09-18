import { useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCanvasStore } from '../store/canvasStore'
import ShapeRenderer from './ShapeRenderer'
import { useToolStore } from '../store/toolStore'
import { getToolInstance } from '../canvas/tools/ToolManager'
import Tool from '../canvas/tools/Tool'

const SCALE_BY = 1.05
const MIN_SCALE = 0.1
const MAX_SCALE = 10

export default function Canvas() {
    const stageRef = useRef<Konva.Stage>(null)
    const tool = useToolStore(state => state.tool)
    const shapes = useCanvasStore(state => state.shapes)
    const toolInstanceRef = useRef<Tool | null>(null)
    const currentlyDrawingShapeId = useCanvasStore(state => state.currentlyDrawingShapeId)
    const isDraggableTool = tool?.type === 'selection'

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()

        const stage = stageRef.current
        if (!stage) return

        const pointer = stage.getPointerPosition()
        if (!pointer) return

        const oldScale = stage.scaleX()

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        }

        const direction = e.evt.deltaY > 0 ? -1 : 1

        const scaleChange = direction > 0 ? SCALE_BY : 1 / SCALE_BY
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, oldScale * scaleChange))

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }

        stage.scale({ x: newScale, y: newScale })
        stage.position(newPos)
    }

    function handlePointerDown(){
        const pointerPosition = stageRef.current?.getRelativePointerPosition()
        if(!pointerPosition) return
        console.log("pointer down: ", pointerPosition)
        toolInstanceRef.current = getToolInstance(tool.type)
        if(!toolInstanceRef.current) return
        toolInstanceRef.current.onPointerDown(pointerPosition)
    }

    function handlePointerMove(){
        const pointerPosition = stageRef.current?.getRelativePointerPosition()
        if(!pointerPosition) return
        console.log("pointer move: ", pointerPosition)
        if(!toolInstanceRef.current || !currentlyDrawingShapeId) return

        toolInstanceRef.current.onPointerMove(currentlyDrawingShapeId, pointerPosition)
    }

    function handlePointerUp(){
        if(!toolInstanceRef.current || !currentlyDrawingShapeId) return

        toolInstanceRef.current.onPointerUp(currentlyDrawingShapeId)
    }

    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            draggable={isDraggableTool}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <Layer>
                {Object.values(shapes).map(shape => (
                    <ShapeRenderer key={shape.id} shape={shape}/>
                ))}
            </Layer>
        </Stage>
    )
}