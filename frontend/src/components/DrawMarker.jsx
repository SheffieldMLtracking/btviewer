
function DrawMarker(props) {
  // current x and y based on the current view
  let circleColour;
  let reticuleColour;
  let annotateBackground;
  let annotateColor; 

  
  if (typeof props !== "undefined" && props !== null) {
    if (props.confidence === true && props.mode==='manual') {
      circleColour = "red";
      reticuleColour = "red";
      annotateBackground = "white";
      annotateColor = "black";

    } else if (props.confidence === false && props.mode==='manual') {
      circleColour = "blue";
      reticuleColour = "blue";
      annotateBackground = "white";
      annotateColor = "black";

    } else if (props.confidence === false && props.mode==='retrodetect'){
      circleColour = "yellow";
      reticuleColour = "transparent";
      annotateBackground = "white";
      annotateColor = "black";

    } else if (props.confidence === true && props.mode==='retrodetect'){
      circleColour = "transparent";
      reticuleColour = "yellow";
      annotateBackground = "white";
      annotateColor = "black";

    } else if (props.mode==='deleted'){ //to make the current deleted tag transparent, before the next render after the label list in backend is updated
      circleColour = "transparent";
      reticuleColour = "transparent";
      annotateBackground = "transparent";
      annotateColor = "transparent";
    }


    return (
      <>
        <div
          style={{
            //circle
            position: "absolute",
            borderWidth: "1px", // Adjust border thickness as needed
            borderStyle: "solid", // Adjust border style (e.g., dashed, dotted)
            borderColor: `${circleColour}`, // Adjust border color as needed
            backgroundColor: "transparent", // Removes background color
            borderRadius: "50%",
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: -10,
            top: -10,
            width: 20,
            height: 20,
            pointerEvents: `${props.pointer}`, //The element on its own is never the target of pointer events.
          }}
        />
        <div
          style={{
            //top verticle line
            position: "absolute",
            backgroundColor: `${reticuleColour}`,
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: 0,
            top: -8,
            width: 2,
            height: 6,
            pointerEvents: `${props.pointer}`,
          }}
        />
        <div
          style={{
            //left horizontal line
            position: "absolute",
            backgroundColor: `${reticuleColour}`,
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: -8,
            top: 0,
            width: 6,
            height: 2,
            pointerEvents: `${props.pointer}`,
          }}
        />
        <div
          style={{
            //bottom verticle line
            position: "absolute",
            backgroundColor: `${reticuleColour}`,
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: 0,
            top: 4,
            width: 2,
            height: 6,
            pointerEvents: `${props.pointer}`,
          }}
        />
        <div
          style={{
            //right horizontal line
            position: "absolute",
            backgroundColor: `${reticuleColour}`,
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: 4,
            top: 0,
            width: 6,
            height: 2,
            pointerEvents: `${props.pointer}`,
          }}
        />
       <div style={{
            //annotation
            position: "absolute",
            backgroundColor: `${annotateBackground}`,
            color: `${annotateColor}`,
            transform: `translate(${props.x}px, ${props.y}px)`,
            left: 15,
            top: 0,
            pointerEvents: `${props.pointer}`,
          }}>{props.annotation}</div>
      </>
    );
  }
}
export default DrawMarker;
