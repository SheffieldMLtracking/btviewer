import "./Image.css";

import { useState, useRef, useEffect } from "react";
import DrawExistingMarkers from "./DrawingExistingMarkers.jsx";

import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Popover from '@mui/material/Popover';

import { SaveMarkers } from "./utils.js";

function Image({ image, dimension, label, photoPath, handlePreviousPhoto, handleNextPhoto }) {
  //Ref for image
  const imgRef = useRef(null);

  // to examine if there is an existing labelled json file whether they are retrodetect or humanlabel, if there is, we will merge the list to the markerlist in the useEffect when there is a change in props, if not we will declare the list as []
  let existingLabel = label.length > 0 ? label : [];
  //let imageWidth = label.length > 0 ? 2048 : 0; //not ideal solution as I am hardcoding it but this is to make it work but may be able to get backend to send the dimension, as first render for detecting image original size does not work here
  //let imageHeight = label.length > 0 ? 1536 : 0; //not ideal solution as I am hardcoding it but this is to make it work but may be able to get backend to send the dimension, as first render for detecting image original size does not work here
  let imageWidth = dimension.width
  let imageHeight = dimension.height
  console.log(dimension.width)
  console.log(label)
  //TODO Get original image size from backend instead !!

  const [annotateCoordinate, setAnnotateCoordinate] = useState({
    x: -99,
    y: -99,
    annotation: ''
  });

  const [anchor, setAnchor] = useState({
    x: -99,
    y: -99,
  });
  

  const [popupOpen, setPopupOpen] = useState(false)

  const [popupID, setPopupID] = useState(undefined)
  //state for photoPath for savingMarkers
  const [currentPhotoPath, setCurrentPhotoPath] = useState("");

  //State for x, y coordinates based on the original image
  const [coordinate, setCoordinate] = useState({
    x: -99,
    y: -99,
    confidence: true,
  });

  //State for array containing objects each of which recording one marker/tag. WARNING the LAST tag may not be recorded due to the useState
  const [markerList, setMarkerList] = useState([]);

  //State for recording the original width/height of the image and view width/height. THIS might not need to be STATE
  const [imageSize, setImageSize] = useState({
    originalWidth: 0,
    originalHeight: 0,
    viewWidth: 683,
    viewHeight: 512,
  });

  //State to determine if ML marker to be shown
  const [showRetrodetect, setShowRetrodetect] = useState(0);

  // for zooming
  let scale = 1;
  let scaleZoomIn = 1.2;
  let scaleZoomOut = 0.8;

  const [imageNewPosition, setImageNewPosition] = useState({
    left: 0,
    top: 0,
  });

  useEffect(() => { // Initialise TODO: May move to button click if button click is the only way to change image
    //reset every initial state when image changes
    setMarkerList(existingLabel);

    setImageSize({
      originalWidth: imageWidth,
      originalHeight: imageHeight,
      viewWidth: 683,
      viewHeight: 512,
    });
    setCoordinate({
      x: -99,
      y: -99,
      confidence: true,
    });
    setShowRetrodetect(0);
    setImageNewPosition({
      left: 0,
      top: 0,
    });
  }, [label]);

  useEffect(() => { //short cut keey

    const handleKeyDown = (e) => {
      if (e.key === 'a' && e.ctrlKey) {
        e.preventDefault()
        handlePreviousPhoto()
      } else if (e.key == 'q' && e.ctrlKey) {
        e.preventDefault()
        handlePreviousPhoto()
      } else if (e.key == 'w' && e.ctrlKey) {
        e.preventDefault()
        handleNextPhoto()
      } else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        handleNextPhoto()
      } else if (e.key === 'z' && e.ctrlKey) {
        e.preventDefault()
        ResetImage()
      } else if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault()
        deleteHandler()
      } else if (e.key === 'r' && e.ctrlKey) {
        e.preventDefault()
        RetrodetectController() //BUG: the keyboard shortcut does not work when retrodetect is 1

      }

    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [])


  useEffect(() => {// when there is a window resize
    const handleResize = () => {
      const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

      // Get the original width and height of the image
      let originalWidth = imageCurrent.naturalWidth;
      let originalHeight = imageCurrent.naturalHeight;

      // Get the height/width of the image container
      let imageRect = imageCurrent.getBoundingClientRect();
      let viewWidth = Math.round(imageRect.width);
      let viewHeight = Math.round(imageRect.height);


      setImageSize({
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  //All the functions
  function clickHandler(e) {
    // determining the coordinates of the click and draw the marker
    const imageCurrent = imgRef.current;
    // Get the original width and height of the image
    let originalWidth = imageCurrent.naturalWidth;
    let originalHeight = imageCurrent.naturalHeight;
    let imageRect = imageCurrent.getBoundingClientRect();
    if (e.shiftKey || e.ctrlKey) {
      //For tagging

      // Get the height/width of the image container
      let viewWidth = Math.round(imageRect.width);
      let viewHeight = Math.round(imageRect.height);

      // Get the coordinates of the clicking based its offset from the image container
      let currentOffsetX = e.nativeEvent.offsetX;
      let currentOffsetY = e.nativeEvent.offsetY;

      // Calculation for the coordinates of the clicking on the original image pixel
      let originalPixelX = Math.round(
        (originalWidth / viewWidth) * currentOffsetX
      );
      let originalPixelY = Math.round(
        (originalHeight / viewHeight) * currentOffsetY
      );



      setImageSize({
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight,
      });

      // Determining if additional keyboard keys are pressed, and record confidence label and any future label accordingly

      if (e.shiftKey) {
        console.log("shift pressed"); //TODO where we can send to backend for saving.
        setCoordinate({
          x: originalPixelX,
          y: originalPixelY,
          confidence: false,
        });
        setMarkerList([
          ...markerList,
          { x: originalPixelX, y: originalPixelY, confidence: false, mode: 'manual' },
        ]);
        console.log(markerList);
        SaveMarkers([{x: originalPixelX,
                            y: originalPixelY,
                            confidence: false,}],
                    photoPath)
      } else if (e.ctrlKey) {
        //TODO where we can send to backend for saving.
        console.log("control is pressed");
        setCoordinate({
          x: originalPixelX,
          y: originalPixelY,
          confidence: true,
        });
        setMarkerList([
          ...markerList,
          { x: originalPixelX, y: originalPixelY, confidence: true, mode: 'manual' },
        ]);
        console.log(markerList);
        SaveMarkers([{x: originalPixelX,
          y: originalPixelY,
          confidence: true,}],
        photoPath)
      }
    } else if (e.altKey || e.metaKey) {
      //for zooming in and out

      if (e.altKey) {
        scale = scaleZoomIn;
      } else if (e.metaKey) {
        scale = scaleZoomOut;
      }
      let updatedRectTop = imageRect.top + window.scrollY;
      let updatedRectLeft = imageRect.left + window.scrollX;

     
      let transformCoordinateX =
        (e.pageX - updatedRectLeft) * scale + updatedRectLeft; // new.e.pageX when the image is enlarged
      let transformCoordinateY =
        (e.pageY - updatedRectTop) * scale + updatedRectTop; // new.e.pageX when the image is enlarged

      console.log("transformCoordinateX", transformCoordinateX);
      console.log("transformCoordinateY", transformCoordinateY);

      let movementLeft = transformCoordinateX - e.pageX;
      let movementTop = transformCoordinateY - e.pageY;
      console.log("movementLeft", movementLeft);
      console.log("movementTop", movementTop);

      let enlargedImageWidth = imageRect.width * scale;
      let enlargedImageHeight = imageRect.height * scale;
      console.log("enlargedImageWidth" + enlargedImageWidth);
      console.log("enlargedImageHeight" + enlargedImageHeight);

      setImageSize({
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        viewWidth: enlargedImageWidth,
        viewHeight: enlargedImageHeight,
      });
      let x = imageNewPosition.left - movementLeft;
      let y = imageNewPosition.top - movementTop;

      setImageNewPosition({ top: y, left: x });
    }
  }

  //Separated from the function above. to control whether to show the ML markers
  function RetrodetectController() {
    console.log(showRetrodetect)
    if (showRetrodetect === 0) {
      setShowRetrodetect(1);

      const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

      // Get the original width and height of the image
      let originalWidth = imageCurrent.naturalWidth;
      let originalHeight = imageCurrent.naturalHeight;

      // Get the height/width of the image container
      let imageRect = imageCurrent.getBoundingClientRect();
      let viewWidth = Math.round(imageRect.width);
      let viewHeight = Math.round(imageRect.height);

      setImageSize({
        originalWidth: originalWidth,
        originalHeight: originalHeight,
        viewWidth: viewWidth,
        viewHeight: viewHeight,
      });
    } else if (showRetrodetect === 1) {
      console.log('i did go through this part')
      setShowRetrodetect(0);
    }
  }

  function ResetImage() {
    setImageSize({
      ...imageSize,
      viewWidth: 683,
      viewHeight: 512,
    });

    setImageNewPosition({
      left: 0,
      top: 0,
    });
  }
  useEffect(() => {
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };
    //Dragging function

    const handlePointerDown = (e) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      prevPosition = { x: e.clientX, y: e.clientY };
      setImageNewPosition((imageNewPosition) => ({
        left: imageNewPosition.left + deltaX,
        top: imageNewPosition.top + deltaY,
      }));
    };
    // Add event listeners
    //imageCurrent?.addEventListener("pointerdown", handlePointerDown);
    //imageCurrent?.addEventListener("pointermove", handlePointerMove);
    //imageCurrent?.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // Remove event listeners on component unmount
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [imgRef]);

  function deleteHandler() {
    setMarkerList([]);
  }

  function rightClickHandler(e) {
    e.preventDefault()
    setPopupOpen(true)
    setPopupID('simple-popover')

    const clientX = e.pageX;
    const clientY = e.pageY;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const adjustedX = clientX - scrollX;
    const adjustedY = clientY - scrollY;

    setAnchor({...anchor,
              x: adjustedX,
              y: adjustedY});

     // determining the coordinates of the click and draw the marker
     const imageCurrent = imgRef.current;
     // Get the original width and height of the image
     let originalWidth = imageCurrent.naturalWidth;
     let originalHeight = imageCurrent.naturalHeight;
     let imageRect = imageCurrent.getBoundingClientRect();
   // Get the height/width of the image container
       let viewWidth = Math.round(imageRect.width);
       let viewHeight = Math.round(imageRect.height);
 
       // Get the coordinates of the clicking based its offset from the image container
       let currentOffsetX = e.nativeEvent.offsetX;
       let currentOffsetY = e.nativeEvent.offsetY;
 
       // Calculation for the coordinates of the clicking on the original image pixel
       let originalPixelX = Math.round(
         (originalWidth / viewWidth) * currentOffsetX
       );
       let originalPixelY = Math.round(
         (originalHeight / viewHeight) * currentOffsetY
       );
 
 
 
     setAnnotateCoordinate({
           x: originalPixelX,
           y: originalPixelY,
         });
     
      ///trial ends
          

    console.log('rightclick')
    console.log('x' + adjustedX)
    console.log('y' + adjustedY)

  }


  function handleClose(e) {
    setPopupOpen(false)
    setPopupID(undefined)
    //Fetch before erase anchor
    console.log('anchor ' + anchor.x + ' ' + anchor.y)
    console.log('AnnotateCoordinate' + annotateCoordinate.x + ' ' + annotateCoordinate.y)
    console.log('coordinate' + coordinate.x + ' ' + coordinate.y)  
    setAnchor({x:-99,
               y:-99,
              });
    setAnnotateCoordinate({x:-99,
                y:-99,
                annotation:''
               });
  };

  function enterHandler(e){
    if (e.key === 'Enter') {
      console.log('xxx')
      handleClose()
  }
  }
  return (
    <>
      <h2>
        {coordinate.x}, {coordinate.y}
      </h2>
      <h2>Confidence boolean {`${coordinate.confidence}`}</h2>
      <h2>retrodetect controller {showRetrodetect}</h2>
      <button onClick={deleteHandler}>Delete All</button>
      <button onClick={RetrodetectController}>Show/Hide Retrodetect labels</button>
      <button onClick={ResetImage}>Reset Zoom</button>
      <div className="ImageOutsideContainer">
        <NavigateBeforeIcon id='previousArrow' onClick={handlePreviousPhoto}></NavigateBeforeIcon>
        <Replay10Icon id='previous10Arrow' onClick={handlePreviousPhoto}></Replay10Icon>


        <div className="ImageContainer">
          <img
            aria-describedby={popupID}
            ref={imgRef}
            src={image}
            onClick={clickHandler}
            onContextMenu={rightClickHandler}
            alt=""
            style={{
              height: `${imageSize.viewHeight}px`,
              width: `${imageSize.viewWidth}px`,
              top: `${imageNewPosition.top}px`,
              left: `${imageNewPosition.left}px`,
            }}
            draggable={false}
          />
          <Popover
            id={popupID}
            open={popupOpen}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: anchor.y-10, left: anchor.x+10 }}

          >
            <input
             id='annotation'
             type="text"
             placeholder="Annotation"
             autoFocus
             onKeyDown={enterHandler}
             value={annotateCoordinate.annotation}
             onChange ={(e) => setAnnotateCoordinate({...annotateCoordinate,
              annotation: e.target.value})}
             ></input>
            </Popover>

          <DrawExistingMarkers
            showRetrodetect={showRetrodetect}
            markerList={markerList}
            imageSize={imageSize}
            imagePosition={imageNewPosition}
          />
        </div>
        <NavigateNextIcon id='nextArrow' onClick={handleNextPhoto}></NavigateNextIcon>
        <Forward10Icon id='next10Arrow' onClick={handleNextPhoto}></Forward10Icon>



      </div>

    </>
  );
}

export default Image;
