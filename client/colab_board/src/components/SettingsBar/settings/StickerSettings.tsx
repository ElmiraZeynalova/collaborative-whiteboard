import StrokeColor from "../fields/StrokeColor";
import FontSize from "../fields/FontSize";
import FillColor from "../fields/FillColor";

export default function StickerSettings(){
    return(
        <>
            <FillColor/>
            <StrokeColor/>
            <FontSize/>
        </>
    )
}