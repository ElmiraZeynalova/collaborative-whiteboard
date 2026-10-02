import { useHocuspocusProvider } from "@hocuspocus/provider-react"
import { useMemo } from "react"
import type { YShape } from "../types/shapes"
import * as Y from 'yjs'

export function useCanvasYjs() {
    const provider = useHocuspocusProvider()
    const ydoc = provider.document

    const yShapes = ydoc.getMap<YShape>('shapes')
    const yShapesOrder = ydoc.getArray<string>('shapesOrder')
    const yBoard = ydoc.getMap<string>('board')

    const yUndoManager = useMemo(
        () => new Y.UndoManager([yShapes, yShapesOrder]),
        [yShapes, yShapesOrder]
    )

    return {
        provider,
        ydoc,
        yShapes,
        yShapesOrder,
        yBoard,
        yUndoManager,
    }
}