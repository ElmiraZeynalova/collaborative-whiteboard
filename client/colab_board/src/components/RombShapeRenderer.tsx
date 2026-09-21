import {Shape} from 'react-konva'
import { type RombShape } from '../types/shapes'

export default function RombShapeRenderer({shape}: {shape: RombShape}){
    const centerX = shape.x + shape.width / 2
    const centerY = shape.y + shape.height / 2
    return(
        <Shape
          sceneFunc={(context, konvaShape) => {
            context.beginPath();
            context.moveTo(centerX, shape.y);
            context.lineTo(shape.x + shape.width, centerY);
            context.lineTo(centerX, shape.y + shape.height);
            context.lineTo(shape.x, centerY)
            context.closePath();
            context.fillStrokeShape(konvaShape);
          }}
          fill={shape.fillStyle}
          stroke={shape.strokeStyle}
          strokeWidth={shape.strokeWidth}
        />
    )
}

