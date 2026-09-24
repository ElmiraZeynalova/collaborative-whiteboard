import { type Shape } from "../types/shapes"
import PencilShapeRenderer from "./PencilShapeRenderer"
import RombShapeRenderer from './RombShapeRenderer'
import {Rect, Text, Ellipse, Group} from 'react-konva'
import type { KonvaEventObject, Node } from 'konva/lib/Node'
import { STICKER_PADDING_X, STICKER_PADDING_TOP, STICKER_PADDING_BOTTOM } from '../utils/constants'
import { registerShapeNode } from '../canvas/shapeNodeRegistry'
import { handleShapeDragEnd } from '../canvas/shapeInteractions'
import { useToolStore } from '../store/toolStore'
import { useCanvasStore } from "../store/canvasStore"
import LineShapeRenderer from "./LineShapeRenderer"

export function getFontSizeNumber(fontSize: string){
    let fontSizeNumber 
    if(fontSize === "S"){
        fontSizeNumber = 14
    }else if(fontSize === "M"){
        fontSizeNumber = 20
    }else if(fontSize === "L"){
        fontSizeNumber = 30
    }else if(fontSize === "XL"){
        fontSizeNumber = 40
    }
    return fontSizeNumber
}
export default function ShapeRenderer({shape}: {shape: Shape}){
    const tool = useToolStore(state => state.tool)
    const isSelectable = tool?.type === 'selection'
    const editingTextId = useCanvasStore(state => state.editingTextId)
    const setEditingTextId = useCanvasStore(state => state.setEditingTextId)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const isSelected = selectedShapesIds.includes(shape.id)

    const commonProps = {
        id: shape.id,
        ref: (node: Node | null) => registerShapeNode(shape.id, node),
        draggable: isSelectable,
        onDragEnd: (e: KonvaEventObject<DragEvent>) => handleShapeDragEnd(shape, e.target),
    }

    switch(shape.type){
        case 'ellipse':
           return(
            <Ellipse
                {...commonProps}
                x={shape.x}
                y={shape.y}
                radiusX={shape.radius.x}
                radiusY={shape.radius.y}
                fill={shape.fillStyle}
                stroke={shape.strokeStyle}
                strokeWidth={shape.strokeWidth}
                rotation={shape.rotation ?? 0}

            />)
        case 'rect':
            return(
                <Rect
                    {...commonProps}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fillStyle}
                    stroke={shape.strokeStyle}
                    strokeWidth={shape.strokeWidth}
                    rotation={shape.rotation ?? 0}
                />
            )
        case 'line':
            return <LineShapeRenderer shape={shape} isSelected={isSelected} commonProps={commonProps}/>
        case 'arrow': 
            return <LineShapeRenderer shape={shape} isSelected={isSelected} commonProps={commonProps}/>
        case 'pencil': 
        case 'eraser':
            return <PencilShapeRenderer shape={shape} commonProps={commonProps}/>
        case 'romb':
            return <RombShapeRenderer shape={shape} commonProps={commonProps}/>
        case 'text':
            if(shape.id === editingTextId) return null
            return(
                <Text
                    {...commonProps}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    align={shape.textAlign}
                    text={shape.text}
                    fontSize={getFontSizeNumber(shape.fontSize)}
                    fontFamily="Calibri"
                    fill={shape.strokeStyle}
                    lineHeight={1.2}
                    rotation={shape.rotation ?? 0}
                    onDblClick={() => setEditingTextId(shape.id)}
                />
            )
        case 'sticker':
            const formattedDate = new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
            return(
                <Group
                    {...commonProps}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    rotation={shape.rotation ?? 0}
                >
                    <Rect
                        x={0}
                        y={0}
                        width={shape.width}
                        height={shape.height}
                        fill={shape.fillStyle}
                        stroke={shape.strokeStyle}
                        strokeWidth={shape.strokeWidth}
                        cornerRadius={20}
                        shadowEnabled={true}
                        shadowBlur={6}
                        shadowOpacity={0.2}
                        shadowOffsetX={4}
                        shadowOffsetY={4}
                    />
                    <Text x={20} y={20} fill={shape.strokeStyle} fontSize={14} fontFamily="Calibri" text={formattedDate}/>
                    {shape.id !== editingTextId && <Text
                        x={STICKER_PADDING_X / 2}
                        y={STICKER_PADDING_TOP}
                        width={shape.width - STICKER_PADDING_X}
                        height={shape.height - STICKER_PADDING_TOP - STICKER_PADDING_BOTTOM}
                        align="center"
                        verticalAlign="middle"
                        text={shape.text}
                        fontSize={getFontSizeNumber(shape.fontSize)}
                        fontFamily="Calibri"
                        fill={shape.strokeStyle}
                        lineHeight={1.2}
                        padding={10}
                        wrap="char"
                        onDblClick={() => setEditingTextId(shape.id)}
                    />}
                </Group>

            )
    }
    return null
}