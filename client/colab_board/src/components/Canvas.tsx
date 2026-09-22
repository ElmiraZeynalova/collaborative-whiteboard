import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Transformer } from 'react-konva'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCanvasStore } from '../store/canvasStore'
import ShapeRenderer from './ShapeRenderer'
import { useToolStore } from '../store/toolStore'
import { getToolInstance } from '../canvas/tools/ToolManager'
import Tool from '../canvas/tools/Tool'
import TextArea from './TextArea'
import { getShapeNodes } from '../canvas/shapeNodeRegistry'
import { handleTransformEnd } from '../canvas/shapeInteractions'

const SCALE_BY = 1.05
const MIN_SCALE = 0.1
const MAX_SCALE = 10

export default function Canvas() {
    const stageRef = useRef<Konva.Stage>(null)
    const tool = useToolStore(state => state.tool)
    const shapes = useCanvasStore(state => state.shapes)
    const toolInstanceRef = useRef<Tool | null>(null)
    const currentlyDrawingShapeId = useCanvasStore(state => state.currentlyDrawingShapeId)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const selectionRectangle = useCanvasStore(state => state.selectionRectangle)
    const isDraggableStage = tool?.type === 'selection' && selectedShapesIds.length === 0
    const editingTextId = useCanvasStore(state => state.editingTextId)
    const [stageReady, setStageReady] = useState(false)
    const setScale = useCanvasStore(state => state.setScale)
    const transformerRef = useRef<Konva.Transformer | null>(null)
    useEffect(() => {
        if (!transformerRef.current) return

        const shapes = useCanvasStore.getState().shapes

        const resizableIds = selectedShapesIds.filter(id => {
            const shape = shapes[id]

            return (
                shape &&
                shape.type !== 'line' &&
                shape.type !== 'arrow'
            )
        })

        const nodes = getShapeNodes(resizableIds)

        transformerRef.current.nodes(nodes)
        transformerRef.current.getLayer()?.batchDraw()
    }, [selectedShapesIds])

    useEffect(() => {
        const container = stageRef.current?.container()
        if (container) {
            container.tabIndex = -1
        }
    }, [])

    useEffect(() => {
        if (stageRef.current) {
            setStageReady(true)
        }
    }, [])

    useEffect(() => {
        toolInstanceRef.current = getToolInstance(tool?.type)
    }, [tool?.type])

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()
        if (editingTextId) return 
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
        setScale(newScale)
    }

    function isTransformerEvent(target: Konva.Node) {
        let node: Konva.Node | null = target

        while (node) {
            if (node.getClassName() === 'Transformer') {
                return true
            }

            node = node.getParent()
        }

        return false
    }

    function getShapeId(target: Konva.Node): string | undefined {
        let node: Konva.Node | null = target

        while (node) {
            const id = node.id()

            if (id) {
                return id
            }

            node = node.getParent()
        }

        return undefined
    }

    function handlePointerDown(e: KonvaEventObject<PointerEvent>) {
        if (isTransformerEvent(e.target)) {
            return
        }

        const pointerPosition = stageRef.current?.getRelativePointerPosition()

        if (!pointerPosition) return

        const modifiers = {
            shiftKey: e.evt.shiftKey,
            ctrlKey: e.evt.ctrlKey,
            metaKey: e.evt.metaKey,
        }

        const targetId = getShapeId(e.target)
       
        toolInstanceRef.current?.onPointerDown(
            pointerPosition,
            modifiers,
            targetId
        )
    }

    function handlePointerMove(e: KonvaEventObject<PointerEvent>) {
        if (isTransformerEvent(e.target)) {
            return
        }

        const pointerPosition = stageRef.current?.getRelativePointerPosition()

        if (!pointerPosition) return

        toolInstanceRef.current?.onPointerMove(
            currentlyDrawingShapeId ?? '',
            pointerPosition
        )
    }

    function handlePointerUp(e: KonvaEventObject<PointerEvent>) {
        if (isTransformerEvent(e.target)) {
            return
        }

        toolInstanceRef.current?.onPointerUp(
            currentlyDrawingShapeId ?? ''
        )
    }

    return (
        <div className="relative">
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                draggable={isDraggableStage}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <Layer>
                    {Object.values(shapes).map(shape => (
                        <ShapeRenderer key={shape.id} shape={shape}/>
                    ))}
                    <Transformer
                        ref={transformerRef}
                        rotateEnabled={true}
                        onTransformEnd={() => {
                            const transformer = transformerRef.current
                            if (!transformer) return

                            const nodes = transformer.nodes()
                            const shapes = useCanvasStore.getState().shapes

                            nodes.forEach(node => {
                                const shape = shapes[node.id()]

                                if (shape) {
                                    handleTransformEnd(shape, node)
                                }
                            })
                        }}
                    />
                    
                    {selectionRectangle.visible && (
                        <Rect
                            x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
                            y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
                            width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
                            height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
                            fill="rgba(59,130,246,0.15)"
                            stroke="#3b82f6"
                            strokeWidth={1}
                        />
                    )}
                </Layer>
            </Stage>
            {stageReady && stageRef.current && <TextArea stage={stageRef.current} />}
        </div>
    )
}