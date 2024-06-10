import DrawMarker from './DrawMarker.jsx';


function DrawExistingMarkers (props){ //imageSize and markerList
    let currentOffsetX
    let currentOffsetY
    let currentConfidence

    let currentOffsetArray = props.markerList.map((item) =>{
        currentOffsetX = Math.round((item.x/props.imageSize.originalWidth)*props.imageSize.viewWidth)
        currentOffsetY = Math.round((item.y/props.imageSize.originalHeight)*props.imageSize.viewHeight)
        currentConfidence = item.confidence
        return {currentOffsetX, currentOffsetY, currentConfidence}
    })

    return (
        <>
        {currentOffsetArray.map((item)=>(
            <DrawMarker x={item.currentOffsetX} y={item.currentOffsetY} confidence = {item.currentConfidence} pointer= 'none'/>
        ))}
        </>
    )
}
export default DrawExistingMarkers