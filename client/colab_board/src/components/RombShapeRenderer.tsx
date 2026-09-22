import {Line} from 'react-konva'
import { type RombShape } from '../types/shapes'

export default function RombShapeRenderer({shape, commonProps}: {shape: RombShape, commonProps: any}){
    return(
        <Line
            {...commonProps}
            points={[
                shape.width / 2, 0,
                shape.width, shape.height / 2,
                shape.width / 2, shape.height,
                0, shape.height / 2,
            ]}
            x={shape.x}
            y={shape.y}
            closed
            rotation={shape.rotation ?? 0}
            fill={shape.fillStyle}
            stroke={shape.strokeStyle}
            strokeWidth={shape.strokeWidth}
        />
    )
}