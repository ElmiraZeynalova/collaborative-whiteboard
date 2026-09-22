import type { ArrowShape, LineShape } from "../types/shapes";
import {Arrow, Line, Group, Circle} from 'react-konva'
import { useCanvasStore } from "../store/canvasStore";
import { useClientStore } from "../store/clientStore";
import type { KonvaEventObject } from "konva/lib/Node"

export default function LineShapeRenderer({shape, isSelected, commonProps}: {shape: ArrowShape | LineShape, isSelected: boolean, commonProps: any}){
    const scale = useCanvasStore(state => state.scale)
    const shapeProps = {
        id: shape.id,
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
                    startX: shape.startX + dx,
                    startY: shape.startY + dy,
                    x: shape.x + dx,
                    y: shape.y + dy,
                }

                useCanvasStore.getState().updateShape(
                    shape.id,
                    changes
                )

                const updated = {
                    ...useCanvasStore.getState().shapes[shape.id],
                    ...changes,
                }

                useClientStore.getState().ws?.send(
                    JSON.stringify({
                        type: 'shape:update',
                        shape: updated,
                    })
                )

                e.target.position({
                    x: 0,
                    y: 0,
                })
            }}
        >
            {shape.type === 'line' ? <Line
                {...shapeProps}
                points={[shape.startX, shape.startY, shape.x, shape.y]}
                stroke={shape.strokeStyle}
                strokeWidth={shape.strokeWidth}
                lineCap="round"
                lineJoin="round"
                hitStrokeWidth={20 / scale}
            /> :
            <Arrow
                {...shapeProps}
                x={shape.startX}
                y={shape.startY}
                points={[
                    0,
                    0,
                    shape.x - shape.startX,
                    shape.y - shape.startY,
                ]}
                pointerLength={10 + shape.strokeWidth}
                pointerWidth={10 + shape.strokeWidth}
                fill={shape.fillStyle}
                stroke={shape.strokeStyle}
                strokeWidth={shape.strokeWidth}
                hitStrokeWidth={20 / scale}
            />}

            {isSelected && (
                <LineShapeResizeHandles shape={shape} />
            )}
        </Group>
    )
}


function LineShapeResizeHandles({
    shape,
}: {
    shape: ArrowShape | LineShape
}) {
    const handleStartDragMove = (
        e: KonvaEventObject<DragEvent>
    ) => {
        e.cancelBubble = true

        useCanvasStore.getState().updateShape(shape.id, {
            startX: e.target.x(),
            startY: e.target.y(),
        })
    }

    const handleEndDragMove = (
        e: KonvaEventObject<DragEvent>
    ) => {
        e.cancelBubble = true

        useCanvasStore.getState().updateShape(shape.id, {
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    const handleDragEnd = (
        e: KonvaEventObject<DragEvent>
    ) => {
        e.cancelBubble = true

        const updated = useCanvasStore.getState().shapes[shape.id]

        useClientStore.getState().ws?.send(
            JSON.stringify({
                type: "shape:update",
                shape: updated,
            })
        )
    }
    const scale = useCanvasStore(state => state.scale)

    const radius = 6 / scale
    const strokeWidth = 1 / scale

    return (
        <>
            <Circle
                x={shape.startX}
                y={shape.startY}
                radius={radius}
                fill="#ffffff"
                stroke='#3b82f6'
                strokeWidth={strokeWidth}
                draggable
                onDragMove={handleStartDragMove}
                onDragEnd={handleDragEnd}
            />

            <Circle
                x={shape.x}
                y={shape.y}
                radius={radius}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={strokeWidth}
                draggable
                onDragMove={handleEndDragMove}
                onDragEnd={handleDragEnd}
            />
        </>
    )
}