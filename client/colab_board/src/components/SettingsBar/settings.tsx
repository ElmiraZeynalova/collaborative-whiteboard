import {FontSize, StrokeColor, TextAlign, FillColor, StrokeWidth} from './fields'

export const AllSettings = () => {
    return(
        <>
            <FillColor/>
            <StrokeColor/>
            <StrokeWidth/>
            <FontSize/>
            <TextAlign/>
        </>
    )
}

export const EraserSettings = () => {
    return(
        <StrokeWidth/>
    )
}

export const LineSettings = () => {
    return(
        <>
            <StrokeColor/>
            <StrokeWidth/>
        </>
    )
}

export const ShapeSettings = () => {
    return(
        <>
            <FillColor/>
            <StrokeColor/>
            <StrokeWidth/>
        </>
    )
}

export const StickerSettings = () => {
    return(
        <>
            <FillColor/>
            <StrokeColor/>
            <FontSize/>
        </>
    )
}

export const TextSettings = () => {
    return(
        <>
            <FontSize/>
            <StrokeColor/>
            <TextAlign/>
        </>
    )
}