import { useMemo } from 'react'
import { Line } from 'react-konva'
import type { YShape } from '../types/shapes'
import { useCanvasStore } from '../store/canvasStore'
import { getShapeNumber, getShapePoints, getShapeStringValue } from '../utils/yShapeGetters'

export default function PencilShapeRenderer({ shape, commonProps }: { shape: YShape, commonProps: any}) {
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const strokeWidth = getShapeNumber(shape, 'strokeWidth')
    const rotation = getShapeNumber(shape, 'rotation')
    const points = getShapePoints(shape)
    const scale = useCanvasStore(state => state.scale)

    const shapePoints = useMemo(
        () => points.flatMap(p => [p.x, p.y]),
        [points]
    )

    return (
        <Line
            {...commonProps}
            points={shapePoints}
            stroke={strokeStyle}
            strokeWidth={strokeWidth}
            hitStrokeWidth={20 / scale}
            lineCap="round"
            lineJoin="round"
            rotation={rotation ?? 0}
        />
    )
}