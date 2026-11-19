import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { useCanvasStore } from '../../store/canvasStore'
import { useToolStore } from '../../store/toolStore'
import { getToolInstance } from '../../canvas/tools/ToolManager'
import Tool from '../../canvas/tools/Tool'
import TextArea from './TextArea'
import { getShapeNodes } from '../../utils/shapeNodeRegistry'
import { handleTransformEnd } from '../../utils/shapeHandlers'
import { getFigureChanges } from '../../utils/figureChanges'
import { calculateZoom } from '../../utils/canvasZoom'
import Menu from './Menu'
import { getShapeType } from '../../utils/yShapeGetters'
import RemoteCursors from './RemoteCursors'
import CanvasStage from './CanvasStage'
import { useCanvasYjs } from '../../hooks/useCanvasYjs'
import { useClientStore } from '../../store/clientStore'

export default function Canvas() {
    const { provider, yShapes, yShapesOrder } = useCanvasYjs()
    const stageRef = useRef<Konva.Stage>(null)
    const tool = useToolStore(state => state.tool)
    const toolInstanceRef = useRef<Tool | null>(null)
    const currentlyDrawingShapeId = useCanvasStore(state => state.currentlyDrawingShapeId)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const setSelectedShapesIds = useCanvasStore(state => state.setSelectedShapesIds)
    const selectionRectangle = useCanvasStore(state => state.selectionRectangle)
    const isDraggableStage = tool === 'selection' && selectedShapesIds.length === 0
    const editingTextId = useCanvasStore(state => state.editingTextId)
    const [stageReady, setStageReady] = useState(false)
    const setScale = useCanvasStore(state => state.setScale)
    const transformerRef = useRef<Konva.Transformer | null>(null)
    const fillColor = useToolStore(state => state.fillColor)
    const strokeColor = useToolStore(state => state.strokeColor)
    const strokeWidth = useToolStore(state => state.strokeWidth)
    const fontSize = useToolStore(state => state.fontSize)
    const textAlign = useToolStore(state => state.textAlign)
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null)
    const [, forceRender] = useState(0)

    useEffect(() => {
        const handleYjsChange = () => {
            forceRender(value => value + 1)
        }

        yShapes.observeDeep(handleYjsChange)
        yShapesOrder.observe(handleYjsChange)

        return () => {
            yShapes.unobserveDeep(handleYjsChange)
            yShapesOrder.unobserve(handleYjsChange)
        }
    }, [yShapes, yShapesOrder])

    useEffect(() => {
        if (!transformerRef.current) return

        const resizableIds = selectedShapesIds.filter(id => {
            const shape = yShapes.get(id)
            if (!shape) return
            const shapeType = getShapeType(shape)
            return (
                shape &&
                shapeType !== 'line' &&
                shapeType !== 'arrow'
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
        toolInstanceRef.current = getToolInstance(tool, { yShapes, yShapesOrder })
        setSelectedShapesIds([])
    }, [tool])

    useEffect(() => {
        const toolState = useToolStore.getState();

        if (!toolState.toolSettingChangedByUser) return;
        if (selectedShapesIds.length === 0) return;

        const changedSetting = toolState.toolSettingChanged;
        if (changedSetting === null) return;

        const settings = {
            fillColor: toolState.fillColor,
            strokeColor: toolState.strokeColor,
            strokeWidth: toolState.strokeWidth,
            fontSize: Number(toolState.fontSize),
            textAlign: toolState.textAlign,
        };

        for (const id of selectedShapesIds) {
            const shape = yShapes.get(id);
            if (!shape) continue;

            const shapeType = getShapeType(shape);

            const shapeChanges = getFigureChanges(shapeType, changedSetting, settings);

            for (const [key, value] of Object.entries(shapeChanges)) {
                shape.set(key, value);
            }
        }

    }, [fillColor, strokeColor, strokeWidth, textAlign, fontSize, selectedShapesIds])

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()
        if (editingTextId) return
        const stage = stageRef.current
        if (!stage) return

        const pointer = stage.getPointerPosition()
        if (!pointer) return

        const oldScale = stage.scaleX()
        const result = calculateZoom({
            pointer,
            stagePosition: {
                x: stage.x(),
                y: stage.y(),
            },
            oldScale,
            deltaY: e.evt.deltaY,
        });

        stage.scale({
            x: result.scale,
            y: result.scale,
        });

        stage.position(result.position);
        setScale(result.scale);
    }

    const handleContextMenu = (e: Konva.KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault()

        if (selectedShapesIds.length === 0) return
        setContextMenu({
            x: e.evt.clientX,
            y: e.evt.clientY,
        })
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

    function handleTransformerEnd() {
        const transformer = transformerRef.current
        if (!transformer) return

        transformer.nodes().forEach(node => {
            const shape = yShapes?.get(node.id())

            if (shape) {
                handleTransformEnd(shape, node)
            }
        })
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

    function updateMyPointer(x: number, y: number) {
        const userName = useClientStore.getState().userName
        if (!userName) return
        provider.setAwarenessField('cursor', { x, y })
    }

    function handlePointerDown(e: KonvaEventObject<PointerEvent>) {

        setContextMenu(null)
        if (isTransformerEvent(e.target)) {
            return
        }

        const pointerPosition = stageRef.current?.getRelativePointerPosition()
        console.log('POINTER DOWN')
        console.log('Pointer position:', pointerPosition)
        console.log('Active tool:', toolInstanceRef.current?.type)
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
            targetId,
        )
    }

    function handlePointerMove(e: KonvaEventObject<PointerEvent>) {
        if (isTransformerEvent(e.target)) {
            return
        }

        const pointerPosition = stageRef.current?.getRelativePointerPosition()

        if (!pointerPosition) return

        updateMyPointer(pointerPosition.x, pointerPosition.y)

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
            <CanvasStage
                stageRef={stageRef}
                transformerRef={transformerRef}
                yShapes={yShapes}
                yShapesOrder={yShapesOrder}
                selectionRectangle={selectionRectangle}
                isDraggableStage={isDraggableStage}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onContextMenu={handleContextMenu}
                onTransformerEnd={handleTransformerEnd}
            />
            <RemoteCursors stageRef={stageRef} />
            {contextMenu && (<Menu position={contextMenu} closeModal={() => setContextMenu(null)} />)}
            {stageReady && stageRef.current && <TextArea stage={stageRef.current} />}
        </div>
    )
}