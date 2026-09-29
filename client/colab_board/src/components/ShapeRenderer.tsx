import { type YShape } from "../types/shapes"
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
import { getShapeId, getShapeNumber, getShapeRadius, getShapeStringValue, getShapeType } from "../utils/yShapeGetters"

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
export default function ShapeRenderer({shape}: {shape: YShape}){
    const shapeId = getShapeId(shape)
    const shapeType = getShapeType(shape)
    const tool = useToolStore(state => state.tool)
    const isSelectable = tool?.type === 'selection'
    const editingTextId = useCanvasStore(state => state.editingTextId)
    const setEditingTextId = useCanvasStore(state => state.setEditingTextId)
    const selectedShapesIds = useCanvasStore(state => state.selectedShapesIds)
    const isSelected = selectedShapesIds.includes(shapeId)

    const commonProps = {
        id: shapeId,
        ref: (node: Node | null) => registerShapeNode(shapeId, node),
        draggable: isSelectable,
        onDragEnd: (e: KonvaEventObject<DragEvent>) => handleShapeDragEnd(shape, e.target),
    }

    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const width = getShapeNumber(shape, 'width')
    const height = getShapeNumber(shape, 'height')
    const radius = getShapeRadius(shape)
    const fillStyle = getShapeStringValue(shape, 'fillStyle')
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const strokeWidth = getShapeNumber(shape, 'strokeWidth')
    const rotation = getShapeNumber(shape, 'rotation')
    const text = getShapeStringValue(shape, 'text')
    const fontSize = getShapeStringValue(shape, 'fontSize')
    const textAlign = getShapeStringValue(shape, 'textAlign')

    switch(shapeType){
        case 'ellipse':
           return(
            <Ellipse
                {...commonProps}
                x={x}
                y={y}
                radiusX={radius.x}
                radiusY={radius.y}
                fill={fillStyle}
                stroke={strokeStyle}
                strokeWidth={strokeWidth}
                rotation={rotation ?? 0}

            />)
        case 'rect':
            return(
                <Rect
                    {...commonProps}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fillStyle}
                    stroke={strokeStyle}
                    strokeWidth={strokeWidth}
                    rotation={rotation ?? 0}
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
            if(shapeId === editingTextId) return null
            return(
                <Text
                    {...commonProps}
                    x={x}
                    y={y}
                    width={width}
                    align={textAlign}
                    text={text}
                    fontSize={getFontSizeNumber(fontSize)}
                    fontFamily="Calibri"
                    fill={strokeStyle}
                    lineHeight={1.2}
                    rotation={rotation ?? 0}
                    onDblClick={() => setEditingTextId(shapeId)}
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
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rotation={rotation ?? 0}
                >
                    <Rect
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill={fillStyle}
                        stroke={strokeStyle}
                        strokeWidth={strokeWidth}
                        cornerRadius={20}
                        shadowEnabled={true}
                        shadowBlur={6}
                        shadowOpacity={0.2}
                        shadowOffsetX={4}
                        shadowOffsetY={4}
                    />
                    <Text x={20} y={20} fill={strokeStyle} fontSize={14} fontFamily="Calibri" text={formattedDate}/>
                    {shapeId !== editingTextId && <Text
                        x={STICKER_PADDING_X / 2}
                        y={STICKER_PADDING_TOP}
                        width={width - STICKER_PADDING_X}
                        height={height - STICKER_PADDING_TOP - STICKER_PADDING_BOTTOM}
                        align="center"
                        verticalAlign="middle"
                        text={text}
                        fontSize={getFontSizeNumber(fontSize)}
                        fontFamily="Calibri"
                        fill={strokeStyle}
                        lineHeight={1.2}
                        padding={10}
                        wrap="char"
                        onDblClick={() => setEditingTextId(shapeId)}
                    />}
                </Group>

            )
    }
    return null
}