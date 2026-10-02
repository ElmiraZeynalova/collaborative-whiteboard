import { useCanvasStore } from "../../store/canvasStore"
import {useEffect, useRef} from 'react'
import type Konva from 'konva'
import { STICKER_PADDING_X, STICKER_PADDING_TOP, STICKER_PADDING_BOTTOM } from "../../utils/constants"
import { getFontSizeNumber } from "./ShapeRenderer"
import { getShapeStringValue, getShapeType, getShapeNumber } from "../../utils/yShapeGetters"

export default function TextArea({ stage }: { stage: Konva.Stage }) {
    const editingTextId = useCanvasStore((state) => state.editingTextId)
    const setEditingTextId = useCanvasStore((state) => state.setEditingTextId)
    const shapes = useCanvasStore((state) => state.yShapes)
    const scale = useCanvasStore((state) => state.scale)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const shape = editingTextId ? shapes?.get(editingTextId) : undefined


    useEffect(() => {
        if (!editingTextId) return

        const frame = requestAnimationFrame(() => {
            textAreaRef.current?.focus()
        })

        return () => cancelAnimationFrame(frame)
    }, [editingTextId])


    if (!editingTextId || !shape) return null

    const shapeType = getShapeType(shape)


    if (!shape || (shapeType !== 'sticker' && shapeType !== 'text')) {
        return null
    }

    const x = getShapeNumber(shape, 'x')
    const y = getShapeNumber(shape, 'y')
    const width = getShapeNumber(shape, 'width')
    const height = getShapeNumber(shape, 'height')
    const strokeStyle = getShapeStringValue(shape, 'strokeStyle')
    const text = getShapeStringValue(shape, 'text')
    const fontSize = getShapeStringValue(shape, 'fontSize')

    const stagePos = stage.position()
    const isSticker = shapeType === 'sticker'

    const textAreaWidth = width - STICKER_PADDING_X * 2

    const textAreaHeight = isSticker
        ? height - STICKER_PADDING_TOP - STICKER_PADDING_BOTTOM
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

            for (const [key, value] of Object.entries(changes)) {
                shape.set(key, value)
            }
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
        fontSize: getFontSizeNumber(fontSize) ?? 14 * scale,
        color: strokeStyle,
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
                    top: (y + height / 2) * scale + stagePos.y,
                    left: (x + width / 2) * scale + stagePos.x,
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
                    defaultValue={text}
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
            defaultValue={text}
            onBlur={finishEditing}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="absolute"
            style={{
                zIndex: 20,
                top: y * scale + stagePos.y,
                left: x * scale + stagePos.x,
                whiteSpace: 'pre',  
                width: `${width * scale}px`,
                ...commonTextAreaStyle,
            }}
        />
    )
}