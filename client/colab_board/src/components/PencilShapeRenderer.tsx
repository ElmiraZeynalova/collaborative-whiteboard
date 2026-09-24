import { useMemo } from 'react'
import { Line } from 'react-konva'
import type { EraserShape, PencilShape } from '../types/shapes'
import { useCanvasStore } from '../store/canvasStore'

export default function PencilShapeRenderer({ shape, commonProps }: { shape: PencilShape | EraserShape, commonProps: any}) {
    const scale = useCanvasStore(state => state.scale)
    const points = useMemo(
        () => shape.points.flatMap(p => [p.x, p.y]),
        [shape.points]
    )

    return (
        <Line
            {...commonProps}
            points={points}
            stroke={shape.strokeStyle}
            strokeWidth={shape.strokeWidth}
            hitStrokeWidth={20 / scale}
            lineCap="round"
            lineJoin="round"
            rotation={shape.rotation ?? 0}
        />
    )
}