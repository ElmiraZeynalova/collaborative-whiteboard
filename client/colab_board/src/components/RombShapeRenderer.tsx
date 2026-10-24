import {Line} from 'react-konva'
import { type YShape } from '../types/shapes'
import { getShapeNumber, getShapeStringValue } from '../utils/yShapeGetters'

export default function RombShapeRenderer({shape, commonProps}: {shape: YShape, commonProps: any}){
    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const width = getShapeNumber(shape, 'width')
    const height = getShapeNumber(shape, 'height')
    const fillStyle = getShapeStringValue(shape, 'fillStyle')
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const strokeWidth = getShapeNumber(shape, 'strokeWidth')
    const rotation = getShapeNumber(shape, 'rotation')

    return(
        <Line
            {...commonProps}
            points={[
                width / 2, 0,
                width, height / 2,
                width / 2, height,
                0, height / 2,
            ]}
            x={x}
            y={y}
            closed
            rotation={rotation ?? 0}
            fill={fillStyle}
            stroke={strokeStyle}
            strokeWidth={strokeWidth}
        />
    )
}