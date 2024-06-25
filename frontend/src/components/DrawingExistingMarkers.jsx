import DrawMarker from "./DrawMarker.jsx";

function DrawExistingMarkers({ markerList, imageSize, imagePosition }) {
  //imageSize and markerList
  let currentOffsetX;
  let currentOffsetY;
  let currentConfidence;

  console.log("imageLeft" + imagePosition.left);
  console.log("imageTop" + imagePosition.top);

  let currentOffsetArray = markerList.map((item) => {
    currentOffsetX =
      Math.round((item.x / imageSize.originalWidth) * imageSize.viewWidth) +
      imagePosition.left;
    currentOffsetY =
      Math.round((item.y / imageSize.originalHeight) * imageSize.viewHeight) +
      imagePosition.top;
    currentConfidence = item.confidence;
    return { currentOffsetX, currentOffsetY, currentConfidence };
  });

  return (
    <>
      {currentOffsetArray.map((item) => (
        <DrawMarker
          x={item.currentOffsetX}
          y={item.currentOffsetY}
          confidence={item.currentConfidence}
          pointer="none"
        />
      ))}
    </>
  );
}
export default DrawExistingMarkers;
