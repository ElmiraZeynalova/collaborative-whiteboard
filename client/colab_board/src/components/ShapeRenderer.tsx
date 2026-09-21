import { type Shape } from "../types/shapes"
import PencilShapeRenderer from "./PencilShapeRenderer"
import RombShapeRenderer from './RombShapeRenderer'
import {Rect, Text, Line, Ellipse, Arrow, Group} from 'react-konva'
import { useCanvasStore } from "../store/canvasStore"
import { STICKER_PADDING_X, STICKER_PADDING_TOP, STICKER_PADDING_BOTTOM } from '../utils/constants'

export default function ShapeRenderer({shape}: {shape: Shape}){
    const editingTextId = useCanvasStore(state => state.editingTextId)
    const setEditingTextId = useCanvasStore(state => state.setEditingTextId)

    switch(shape.type){
        case 'ellipse':
            return(
                <Ellipse
                    x={shape.x}
                    y={shape.y}
                    radiusX={shape.radius.x}
                    radiusY={shape.radius.y}
                    fill={shape.fillStyle}
                    stroke={shape.strokeStyle}
                    strokeWidth={shape.strokeWidth}
                />
            )
        case 'rect':
            return(
                <Rect
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fillStyle}
                    stroke={shape.strokeStyle}
                    strokeWidth={shape.strokeWidth}
                />
            )
        case 'line':
            return(
                <Line
                    points={[shape.startX, shape.startY, shape.x, shape.y]}
                    stroke={shape.strokeStyle}
                    strokeWidth={shape.strokeWidth}
                    lineCap="round"
                    lineJoin="round"
                />
            )
        case 'arrow':
            return(
                <Arrow
                    x={shape.startX}
                    y={shape.startY}
                    points={[0, 0, shape.x - shape.startX, shape.y - shape.startY]}
                    pointerLength={10 + shape.strokeWidth}
                    pointerWidth={10 + shape.strokeWidth}
                    fill={shape.fillStyle}
                    stroke={shape.strokeStyle}
                    strokeWidth={shape.strokeWidth}
                />
        )
        case 'pencil': 
        case 'eraser':
            return <PencilShapeRenderer shape={shape}/>
        case 'romb':
            return <RombShapeRenderer shape={shape}/>
        case 'text':
            if(shape.id === editingTextId) return null
            return(
                <Text
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    align={shape.textAlign}
                    text={shape.text}
                    fontSize={shape.fontSize}
                    fontFamily="Calibri"
                    fill={shape.strokeStyle}
                    lineHeight={1.2}
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
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
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
                        fontSize={shape.fontSize}
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