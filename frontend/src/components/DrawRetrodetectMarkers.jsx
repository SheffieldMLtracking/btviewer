import { RetrodetectOutput } from "../mockData/RetrodetectOutput.js"; //mockList assuming from the machine learning labelling sent from the backend
import DrawMarker from "./DrawMarker.jsx";

function DrawRetrodetectMarkers({ showRetrodetect, imageSize, imagePosition }) {
  if (showRetrodetect === 0) {
    //Don't draw anything
    return null;
  } else {
    let currentOffsetX;
    let currentOffsetY;

    let currentOffsetArray = RetrodetectOutput.map((item) => {
      currentOffsetX =
        Math.round((item.x / imageSize.originalWidth) * imageSize.viewWidth) +
        imagePosition.left;
      currentOffsetY =
        Math.round((item.y / imageSize.originalHeight) * imageSize.viewHeight) +
        imagePosition.top;
      return { currentOffsetX, currentOffsetY };
    });

    return (
      <>
        {currentOffsetArray.map((item) => (
          <DrawMarker
            x={item.currentOffsetX}
            y={item.currentOffsetY}
            pointer="none"
          />
        ))}
      </>
    );
  }
}

export default DrawRetrodetectMarkers;
