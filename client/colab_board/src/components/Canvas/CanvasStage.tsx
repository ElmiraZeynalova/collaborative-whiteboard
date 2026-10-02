import {Stage, Layer, Transformer, Rect} from 'react-konva'
import Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { YShape, SelectionRectangleState } from '../../types/shapes'
import * as Y from 'yjs'
import ShapeRenderer from './ShapeRenderer'

type Props = {
    stageRef: React.RefObject<Konva.Stage | null>
    transformerRef: React.RefObject<Konva.Transformer | null>
    yShapes: Y.Map<YShape>
    yShapesOrder: Y.Array<string>
    selectionRectangle: SelectionRectangleState
    isDraggableStage: boolean
    onWheel: (e: KonvaEventObject<WheelEvent>) => void
    onPointerDown: (e: KonvaEventObject<PointerEvent>) => void
    onPointerMove: (e: KonvaEventObject<PointerEvent>) => void
    onPointerUp: (e: KonvaEventObject<PointerEvent>) => void
    onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>) => void
    onTransformerEnd: () => void
}

export default function CanvasStage({
    stageRef,
    transformerRef,
    yShapes,
    yShapesOrder,
    selectionRectangle,
    isDraggableStage,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onContextMenu,
    onTransformerEnd
}: Props){
    return(
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            draggable={isDraggableStage}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onContextMenu={onContextMenu}

        >
            <Layer>
                {yShapesOrder.map(id => {
                    const shape = yShapes.get(id)

                    if (!shape || shape.get('isDeleted')) return null

                    return (
                        <ShapeRenderer
                            key={id}
                            shape={shape}
                        />
                    )
                })}
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    onTransformEnd={onTransformerEnd}
                />
                
                {selectionRectangle.visible && (
                    <Rect
                        x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
                        y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
                        width={Math.abs(selectionRectangle.x2 - selectionRectangle.x1)}
                        height={Math.abs(selectionRectangle.y2 - selectionRectangle.y1)}
                        fill="rgba(59,130,246,0.15)"
                        stroke="#3b82f6"
                        strokeWidth={1}
                    />
                )}
            </Layer>
        </Stage>
    )
}