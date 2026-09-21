import { useMemo } from 'react'
import { Line } from 'react-konva'
import type { EraserShape, PencilShape } from '../types/shapes'

export default function PencilShapeRenderer({ shape }: { shape: PencilShape | EraserShape }) {
    const points = useMemo(
        () => shape.points.flatMap(p => [p.x, p.y]),
        [shape.points]
    )

    return (
        <Line
            points={points}
            stroke={shape.strokeStyle}
            strokeWidth={shape.strokeWidth}
            lineCap="round"
            lineJoin="round"
        />
    )
}