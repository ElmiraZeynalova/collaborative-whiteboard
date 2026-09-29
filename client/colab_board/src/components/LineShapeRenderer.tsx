import type {YShape } from "../types/shapes";
import {Arrow, Line, Group, Circle} from 'react-konva'
import { useCanvasStore } from "../store/canvasStore";
import type { KonvaEventObject } from "konva/lib/Node"
import { getShapeId, getShapeNumber, getShapeStringValue, getShapeType } from '../utils/yShapeGetters'

export default function LineShapeRenderer({shape, isSelected, commonProps}: {shape: YShape, isSelected: boolean, commonProps: any}){
    const scale = useCanvasStore(state => state.scale)

    const shapeType = getShapeType(shape)
    const shapeId = getShapeId(shape)
    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const startX = getShapeNumber(shape, 'startX')
    const startY = getShapeNumber(shape, 'startY')
    const fillStyle = getShapeStringValue(shape, 'fillStyle')
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const strokeWidth = getShapeNumber(shape, 'strokeWidth')

    const shapeProps = {
        id: shapeId,
        ref: commonProps.ref,
    }

    return(
        <Group
            {...commonProps}
            x={0}
            y={0}
            draggable
            onDragEnd={(e) => {
                const dx = e.target.x()
                const dy = e.target.y()

                const changes = {
                    startX: startX + dx,
                    startY: startY + dy,
                    x: x + dx,
                    y: y + dy,
                }

                for (const [key, value] of Object.entries(changes)) {
                    shape.set(key, value)
                }

                e.target.position({
                    x: 0,
                    y: 0,
                })
            }}
        >
            {shapeType === 'line' ? <Line
                {...shapeProps}
                points={[startX, startY, x, y]}
                stroke={strokeStyle}
                strokeWidth={strokeWidth}
                lineCap="round"
                lineJoin="round"
                hitStrokeWidth={20 / scale}
            /> :
            <Arrow
                {...shapeProps}
                x={startX}
                y={startY}
                points={[
                    0,
                    0,
                    x - startX,
                    y - startY,
                ]}
                pointerLength={10 + strokeWidth}
                pointerWidth={10 + strokeWidth}
                fill={fillStyle}
                stroke={strokeStyle}
                strokeWidth={strokeWidth}
                hitStrokeWidth={20 / scale}
            />}

            {isSelected && (
                <LineShapeResizeHandles shape={shape} />
            )}
        </Group>
    )
}


function LineShapeResizeHandles({shape}: {shape: YShape}) {

    const handleStartDragMove = (e: KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true

        shape.set('startX', e.target.x())
        shape.set('startY', e.target.y())
    }

    const handleEndDragMove = (e: KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true

        shape.set('x', e.target.x())
        shape.set('y', e.target.y())
    }

    const scale = useCanvasStore(state => state.scale)

    const radius = 6 / scale
    const strokeWidth = 1 / scale
    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const startX = getShapeNumber(shape, 'startX')
    const startY = getShapeNumber(shape, 'startY')

    return (
        <>
            <Circle
                x={startX}
                y={startY}
                radius={radius}
                fill="#ffffff"
                stroke='#3b82f6'
                strokeWidth={strokeWidth}
                draggable
                onDragMove={handleStartDragMove}
            />

            <Circle
                x={x}
                y={y}
                radius={radius}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={strokeWidth}
                draggable
                onDragMove={handleEndDragMove}
            />
        </>
    )
}