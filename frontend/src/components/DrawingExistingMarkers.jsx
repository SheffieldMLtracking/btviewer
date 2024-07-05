import DrawMarker from "./DrawMarker.jsx";

function DrawExistingMarkers({ showRetrodetect, markerList, imageSize, imagePosition }) {
  //imageSize and markerList
  let currentOffsetX;
  let currentOffsetY;
  let currentConfidence;
  let currentMode; //Options 'retrodetect' or 'manual'
  let processList = markerList

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
    return { currentOffsetX, currentOffsetY, currentConfidence, currentMode };
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
        />
      ))}
    </>
  );
}
export default DrawExistingMarkers;
