import { useCanvasStore } from "../store/canvasStore"
import { useClientStore } from "../store/clientStore"
import {useEffect, useRef} from 'react'
import type Konva from 'konva'
import { STICKER_PADDING_X, STICKER_PADDING_TOP, STICKER_PADDING_BOTTOM } from '../utils/constants'
import { getFontSizeNumber } from "./ShapeRenderer"

export default function TextArea({ stage }: { stage: Konva.Stage }) {
    const editingTextId = useCanvasStore((state) => state.editingTextId)
    const setEditingTextId = useCanvasStore((state) => state.setEditingTextId)
    const shapes = useCanvasStore((state) => state.shapes)
    const updateShape = useCanvasStore((state) => state.updateShape)
    const ws = useClientStore((state) => state.ws)
    const scale = useCanvasStore((state) => state.scale)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const pushToUndo = useCanvasStore(state => state.pushToUndo)
    const shape = editingTextId ? shapes[editingTextId] : null

    useEffect(() => {
        if (!editingTextId) return

        const frame = requestAnimationFrame(() => {
            textAreaRef.current?.focus()
        })

        return () => cancelAnimationFrame(frame)
    }, [editingTextId])

    if (!shape || (shape.type !== 'sticker' && shape.type !== 'text')) {
        return null
    }

    const stagePos = stage.position()
    const isSticker = shape.type === 'sticker'

    const textAreaWidth = shape.width - STICKER_PADDING_X * 2

    const textAreaHeight = isSticker
        ? shape.height - STICKER_PADDING_TOP - STICKER_PADDING_BOTTOM
        : 0

    const finishEditing = () => {
        const value = textAreaRef.current?.value ?? ''

        if (value.trim() !== '') {
            const changes = isSticker
                ? { text: value }
                : {
                    text: value,
                    width: (textAreaRef.current?.offsetWidth ?? 0) / scale
                }
            updateShape(shape.id, changes)

            const updatedShape = useCanvasStore.getState().shapes[shape.id]

            const message = {
                type: 'shape:update',
                shape: updatedShape,
            }

            ws?.send(JSON.stringify(message))
            pushToUndo({
                type: 'update',
                changes: [
                    {
                        shapeId: shape.id,
                        before: shape,
                        after: updatedShape
                    }
                ]
            })
        }

        setEditingTextId(null)
    }

    const handleInput = () => {
        if (!textAreaRef.current || isSticker) return

        textAreaRef.current.style.width = 'auto'
        textAreaRef.current.style.width =
            `${textAreaRef.current.scrollWidth}px`
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            setEditingTextId(null)
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            finishEditing()
        }
    }

    const commonTextAreaStyle: React.CSSProperties = {
        fontSize: getFontSizeNumber(shape.fontSize) ?? 14 * scale,
        color: shape.strokeStyle,
        background: 'transparent',
        fontFamily: 'Calibri, sans-serif',
        outline: 'none',
        resize: 'none',
        padding: 0,
        margin: 0,
        lineHeight: 1.2,
        overflow: 'hidden',
        border: 'none',
        boxSizing: 'border-box',
    }

    if (isSticker) {
        return (
            <div
                style={{
                    position: 'absolute',
                    zIndex: 20,
                    top: (shape.y + shape.height / 2) * scale + stagePos.y,
                    left: (shape.x + shape.width / 2) * scale + stagePos.x,
                    width: textAreaWidth * scale,
                    height: textAreaHeight * scale,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <textarea
                    ref={textAreaRef}
                    defaultValue={shape.text}
                    onBlur={finishEditing}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    style={{
                        ...commonTextAreaStyle,
                        width: '100%',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                    }}
                />
            </div>
        )
    }

    return (
        <textarea
            ref={textAreaRef}
            defaultValue={shape.text}
            onBlur={finishEditing}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute"
            style={{
                zIndex: 20,
                top: shape.y * scale + stagePos.y,
                left: shape.x * scale + stagePos.x,
                whiteSpace: 'pre',  
                width: `${shape.width * scale}px`,
                ...commonTextAreaStyle,
            }}
        />
    )
}