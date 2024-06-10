import { RetrodetectOutput } from '../mockData/RetrodetectOutput.js' //mockList assuming from the machine learning labelling sent from the backend
import DrawMarker from './DrawMarker.jsx';


function DrawRetrodetectMarkers (props) {
   if (props.control===0){ //Don't draw anything
    return null
        
   } else {
        let currentOffsetX
        let currentOffsetY

        let currentOffsetArray = RetrodetectOutput.map((item) =>{
            currentOffsetX = Math.round((item.x/props.imageSize.originalWidth)*props.imageSize.viewWidth)
            currentOffsetY = Math.round((item.y/props.imageSize.originalHeight)*props.imageSize.viewHeight)
            return {currentOffsetX, currentOffsetY}
        })

    return (
        <>
        {currentOffsetArray.map((item)=>(
            <DrawMarker x={item.currentOffsetX} y={item.currentOffsetY} pointer='none'/>
        ))}
        </>
    )
   }
    
}

export default DrawRetrodetectMarkers


