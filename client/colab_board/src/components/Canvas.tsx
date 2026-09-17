import { useRef } from 'react'
import { Stage, Layer, Circle } from 'react-konva'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'

const SCALE_BY = 1.05
const MIN_SCALE = 0.1
const MAX_SCALE = 10

export default function Canvas() {
    const stageRef = useRef<Konva.Stage>(null)

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

    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            draggable
            onWheel={handleWheel}
        >
            <Layer>
                <Circle
                    x={window.innerWidth / 2}
                    y={window.innerHeight / 2}
                    radius={50}
                    fill="red"
                />
            </Layer>
        </Stage>
    )
}