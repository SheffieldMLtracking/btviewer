import DrawMarker from "./DrawMarker.jsx";

function DrawExistingMarkers({ showRetrodetect, markerList, imageSize, imagePosition, showAnnotation }) {
  //imageSize and markerList
  let currentOffsetX;
  let currentOffsetY;
  let currentConfidence;
  let currentMode; //Options 'retrodetect' or 'manual' or 'deleted'(only in the frontend)
  let currentAnnotation;
  let processList = markerList

  //determine if retrodetect needs to be shown
  if (showRetrodetect === 0) { 
    processList = processList.filter(item => item['mode'] !== 'retrodetect');
  }
 
  let currentOffsetArray = processList.map((item) => {
    currentOffsetX =
      Math.round((item.x / imageSize.originalWidth) * imageSize.viewWidth) +
      imagePosition.left;
    currentOffsetY =
      Math.round((item.y / imageSize.originalHeight) * imageSize.viewHeight) +
      imagePosition.top;
    currentConfidence = item.confidence;
    currentMode = item.mode;
    if (showAnnotation===1) {
      currentAnnotation = item.annotation
    } else if (showAnnotation===0) {
      currentAnnotation = ''
    }

    return { currentOffsetX, currentOffsetY, currentConfidence, currentMode, currentAnnotation };
  });
  




  return (
    <>
      {currentOffsetArray.map((item) => (
        <DrawMarker
          x={item.currentOffsetX}
          y={item.currentOffsetY}
          confidence={item.currentConfidence}
          mode={item.currentMode}
          pointer="none"
          annotation={item.currentAnnotation}
        />
      ))}
    </>
  );
}
export default DrawExistingMarkers;
