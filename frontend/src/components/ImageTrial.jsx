import './ImageTrial.css'
import image from '../mockData/test.jpg'

import { useState, useRef, useEffect } from 'react'
import DrawRetrodetectMarkers from './DrawRetrodetectMarkers.jsx';
import DrawExistingMarkers from './DrawingExistingMarkers.jsx';
/*import SaveMarkers from './SaveMarkers.jsx';*/

/*
A bee tracking photo
*/
function ImageTrial () {

  //Ref for image
  const imgRef = useRef(null);


  //State for x, y coordinates based on the original image 
  const [coordinate, setCoordinate] = useState({
    x: -99,
    y: -99,
    confidence: 'Initialization',
  });

  //State for array containing objects each of which recording one marker/tag. WARNING the LAST tag may not be recorded due to the useState
  const [markerList, setMarkerList] = useState([])


  //State for x, y onscreen, no longer in use anymore
  const [coordinateOnImage, setCoordinateOnImage] = useState({
    x: 0,
    y: 0
  });

  //State for recording the original width/height of the image and view width/height. THIS might not need to be STATE
  const [imageSize, setImageSize] = useState({
    originalWidth : 0,
    originalHeight : 0,
    viewWidth : 0,
    viewHeight : 0
  })

  //State to determine if ML marker to be shown
  const [showML, setShowML] = useState(0)


  useEffect(() => {
    const handleResize = () => {
      const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

      // Get the original width and height of the image
      let originalX = imageCurrent.naturalWidth; 
      let originalY = imageCurrent.naturalHeight;

      // Get the height/width of the image container
      let imageRect = imageCurrent.getBoundingClientRect();
      let viewX = Math.round(imageRect.width)
      let viewY = Math.round(imageRect.height)
     
      // Console.log to be deleted.
      console.log('viewX ' + viewX )
      console.log('viewY ' + viewY )

      setImageSize({
        originalWidth : originalX,
        originalHeight : originalY,
        viewWidth : viewX,
        viewHeight : viewY
      })  

      }
      window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])



  //All the functions
  function clickHandler(e){ // determining the coordinates of the click and draw the marker
    const imageCurrent = imgRef.current;

    // Get the original width and height of the image
    let originalX = imageCurrent.naturalWidth; 
	  let originalY = imageCurrent.naturalHeight;

    // Get the height/width of the image container
    let imageRect = imageCurrent.getBoundingClientRect();
    let viewX = Math.round(imageRect.width)
    let viewY = Math.round(imageRect.height)

    // Get the coordinates of the clicking based its offset from the image container
    let currentOffsetX = e.nativeEvent.offsetX
    let currentOffsetY = e.nativeEvent.offsetY

    // Calculation for the coordinates of the clicking on the original image pixel
	  let originalPixelX = Math.round((originalX / viewX) * currentOffsetX)
	  let originalPixelY = Math.round((originalY / viewY) * currentOffsetY)

    // Console.log to be deleted.
    console.log('View width & height',imageRect.width, imageRect.height)
    console.log('Original width & height', originalX,originalY)
    console.log('Offset X & Y', e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    console.log('client X & client Y', e.clientX, e.clientY)
    console.log('original pixel x & y', originalPixelX, originalPixelY)

    setCoordinateOnImage({
        x: currentOffsetX,
        y: currentOffsetY,
      })

    setImageSize({
      originalWidth : originalX,
      originalHeight : originalY,
      viewWidth : viewX,
      viewHeight : viewY
    })  

    console.log(imageSize)
    // Determining if additional keyboard keys are pressed, and record confidence label and any future label accordingly
    //https://react.dev/reference/react-dom/components/common#mouseevent-handler
    if (e.shiftKey) {
        console.log('shift pressed')
        setCoordinate({
          x: originalPixelX,
          y: originalPixelY,
          confidence: "Unsure"
        })
        setMarkerList([...markerList, 
          {x: originalPixelX,
            y: originalPixelY,
            confidence: "Unsure"}])
            console.log(markerList)



      } else if (e.ctrlKey) {
        console.log('control is pressed')
        setCoordinate({
          x: originalPixelX,
          y: originalPixelY,
          confidence: "Sure"
        })
        setMarkerList([...markerList, 
          {x: originalPixelX,
            y: originalPixelY,
            confidence: "Sure"}])
            console.log(markerList)

      } else if (e.arrowUp){
        console.log('alt is pressed');

      } else if (e.keyCode===65){
        console.log('tab is pressed');

      }

    }

    //Separated from the function above. to control whether to show the ML markers
    function MLcontroller (){
      if (showML ===0){
        setShowML(1)

        const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

        // Get the original width and height of the image
        let originalX = imageCurrent.naturalWidth; 
	      let originalY = imageCurrent.naturalHeight;

        // Get the height/width of the image container
        let imageRect = imageCurrent.getBoundingClientRect();
        let viewX = Math.round(imageRect.width)
        let viewY = Math.round(imageRect.height)

        setImageSize({
          originalWidth : originalX,
          originalHeight : originalY,
          viewWidth : viewX,
          viewHeight : viewY
        })  

      } else {
        setShowML(0)
      }
    }
   
        /* use another state annotation position array to save all markers for current image, when next image is clicked, then remove this array and s*/
    return (
      <>
        <h1>{coordinate.x}, {coordinate.y}</h1>
        <h2>Confidence {coordinate.confidence}</h2>
        <button onClick={MLcontroller}>Show ML labels</button>
        <div className='ImageContainer'>
            <img ref={imgRef} src={image} onClick={clickHandler} alt=''/>
            <DrawRetrodetectMarkers control={showML} imageSize={imageSize}/>
            <DrawExistingMarkers markerList={markerList} imageSize={imageSize} />

        </div>
      </>
    )
}

export default ImageTrial