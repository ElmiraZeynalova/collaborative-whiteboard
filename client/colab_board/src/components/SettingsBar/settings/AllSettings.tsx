import FontSize from '../fields/FontSize'
import StrokeColor from '../fields/StrokeColor'
import TextAlign from '../fields/TextAlign'
import FillColor from '../fields/FillColor'
import StrokeWidth from '../fields/StrokeWidth'

export default function AllSettings(){
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