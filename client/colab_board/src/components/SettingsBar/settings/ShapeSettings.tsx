import FillColor from "../fields/FillColor"
import StrokeColor from "../fields/StrokeColor"
import StrokeWidth from "../fields/StrokeWidth"

export default function ShapeSettings(){
    return(
        <>
            <FillColor/>
            <StrokeColor/>
            <StrokeWidth/>
        </>
    )
}