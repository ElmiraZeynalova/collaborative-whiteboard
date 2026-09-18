import { type Shape } from "../types/shapes"
import {Rect, Text, Line, Ellipse, Arrow} from 'react-konva'

export default function ShapeRenderer({shape}: {shape: Shape}){
    switch(shape.type){
        case 'ellipse':
            return(
                <Ellipse
                    x={window.innerWidth / 2}
                    y={window.innerHeight / 2}
                    radiusX={100}
                    radiusY={50}
                    fill="yellow"
                    stroke="black"
                    strokeWidth={4}
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
    }
    return null
}