import './Image.css'

import { useState, useRef, useEffect } from 'react'
import DrawRetrodetectMarkers from './DrawRetrodetectMarkers.jsx';
import DrawExistingMarkers from './DrawingExistingMarkers.jsx';
import SaveMarkers from './SaveMarkers.jsx';

/*
A bee tracking photo
import image from '../mockData/test.jpg'

*/
function Image (props) {
  //Ref for image
  const imgRef = useRef(null);
  console.log('IN IMAGE COMPONENT')
  console.log(props.image)
  console.log(props.existingLabel)

  //State for x, y coordinates based on the original image 
  const [coordinate, setCoordinate] = useState({
    x: -99,
    y: -99,
    confidence: 'Initialization',
  });

  //State for array containing objects each of which recording one marker/tag. WARNING the LAST tag may not be recorded due to the useState
  const [markerList, setMarkerList] = useState([])

  useEffect (() => { //reset every initial state when image changes
    if(props.existingLabel.length === 0){
      setMarkerList([])
    } else if (props.existingLabel.length > 0 ) {
      setMarkerList([props.existingLabel])
    }

    setImageSize({
      originalWidth : 0,
      originalHeight : 0,
      viewWidth : 683,
      viewHeight : 512
    })
    setCoordinate({
      x: -99,
      y: -99,
      confidence: 'Initialization'
    })
    setShowRetrodetect(0)
    setImageNewPosition({
      left: 0,
      top: 0,
    })
    
  }, [props])

  //State for recording the original width/height of the image and view width/height. THIS might not need to be STATE
  const [imageSize, setImageSize] = useState({
    originalWidth : 0,
    originalHeight : 0,
    viewWidth : 683,
    viewHeight : 512
  })

  //State to determine if ML marker to be shown
  const [showRetrodetect, setShowRetrodetect] = useState(0)

  // for zooming
  let scale = 1
  let scaleZoomIn = 1.2
  let scaleZoomOut = 0.8

  const [imageNewPosition, setImageNewPosition] = useState({
      left: 0,
      top: 0,
  })
  // for zooming in

  useEffect(() => {
    const handleResize = () => {
      const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

      // Get the original width and height of the image
      let originalWidth = imageCurrent.naturalWidth; 
      let originalHeight = imageCurrent.naturalHeight;

      // Get the height/width of the image container
      let imageRect = imageCurrent.getBoundingClientRect();
      let viewWidth = Math.round(imageRect.width)
      let viewHeight = Math.round(imageRect.height)
     
      // Console.log to be deleted.
      console.log('viewX ' + viewWidth )
      console.log('viewY ' + viewHeight )

      setImageSize({
        originalWidth : originalWidth,
        originalHeight : originalHeight,
        viewWidth : viewWidth,
        viewHeight : viewHeight
      })  

      }
      window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])



  //All the functions
  function clickHandler(e){ // determining the coordinates of the click and draw the marker
    const imageCurrent = imgRef.current;



    if (e.shiftKey||e.ctrlKey){
    // Get the original width and height of the image
    let originalWidth = imageCurrent.naturalWidth; 
	  let originalHeight = imageCurrent.naturalHeight;

    // Get the height/width of the image container
    let imageRect = imageCurrent.getBoundingClientRect();
    let viewWidth = Math.round(imageRect.width)
    let viewHeight = Math.round(imageRect.height)

    // Get the coordinates of the clicking based its offset from the image container
    let currentOffsetX = e.nativeEvent.offsetX
    let currentOffsetY = e.nativeEvent.offsetY

    // Calculation for the coordinates of the clicking on the original image pixel
	  let originalPixelX = Math.round((originalWidth / viewWidth) * currentOffsetX)
	  let originalPixelY = Math.round((originalHeight / viewHeight) * currentOffsetY)

    // Console.log to be deleted.
    console.log('View width & height',imageRect.width, imageRect.height)
    console.log('Original width & height', originalWidth,originalHeight)
    console.log('Offset X & Y', e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    console.log('client X & client Y', e.clientX, e.clientY)
    console.log('original pixel x & y', originalPixelX, originalPixelY)



    setImageSize({
      originalWidth : originalWidth,
      originalHeight : originalHeight,
      viewWidth : viewWidth,
      viewHeight : viewHeight
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

      }
      } else if (e.altKey||e.metaKey){

        if (e.altKey){
          scale = scaleZoomIn
        } else if (e.metaKey){
          scale = scaleZoomOut
        }
        const imageCurrent = imgRef.current;

        let imageRect = imageCurrent.getBoundingClientRect();

        let originalWidth = imageCurrent.naturalWidth; 
        let originalHeight = imageCurrent.naturalHeight;
        let updatedRectTop =  imageRect.top +  window.scrollY
        let updatedRectLeft = imageRect.left + window.scrollX

        console.log('mouseClick')

        console.log('e.nativeEvent.offsetX' + e.nativeEvent.offsetX)
        console.log('e.nativeEvent.offsetY' + e.nativeEvent.offsetY)
        console.log('e.pageX' + e.pageX)
        console.log('e.pageY' + e.pageY)


        console.log(imageCurrent)
        console.log(imageRect)
        console.log('Updated imageRect.left ' + updatedRectLeft )
        console.log('Updated imageRect.top ' + updatedRectTop )

        let transformCoordinateX = (e.pageX - updatedRectLeft) * scale + updatedRectLeft // new.e.pageX when the image is enlarged
        let transformCoordinateY = (e.pageY - updatedRectTop) * scale + updatedRectTop // new.e.pageX when the image is enlarged

        console.log('transformCoordinateX', transformCoordinateX)
        console.log('transformCoordinateY', transformCoordinateY)

        let movementLeft = (transformCoordinateX - e.pageX)
        let movementTop = (transformCoordinateY - e.pageY)
        console.log('movementLeft', movementLeft)
        console.log('movementTop', movementTop)


        let enlargedImageWidth = imageRect.width*scale
        let enlargedImageHeight = imageRect.height*scale
        console.log('enlargedImageWidth' + enlargedImageWidth)
        console.log('enlargedImageHeight' + enlargedImageHeight)


        setImageSize({
          originalWidth : originalWidth,
          originalHeight : originalHeight,
          viewWidth : enlargedImageWidth,
          viewHeight : enlargedImageHeight
        })  
        let x = imageNewPosition.left - movementLeft
        let y = imageNewPosition.top - movementTop

        setImageNewPosition(
            {top: y,
            left: x
            }
        ) 
      }
    }

    //Separated from the function above. to control whether to show the ML markers
    function RetrodetectController (){
      if (showRetrodetect ===0){
        setShowRetrodetect(1)

        const imageCurrent = imgRef.current; //so that it will still work when clickHandler has not been called

        // Get the original width and height of the image
        let originalWidth = imageCurrent.naturalWidth; 
	      let originalHeight = imageCurrent.naturalHeight;

        // Get the height/width of the image container
        let imageRect = imageCurrent.getBoundingClientRect();
        let viewWidth = Math.round(imageRect.width)
        let viewHeight = Math.round(imageRect.height)

        setImageSize({
          originalWidth : originalWidth,
          originalHeight : originalHeight,
          viewWidth : viewWidth,
          viewHeight : viewHeight
        })  

      } else {
        setShowRetrodetect(0)
      }
    }
   
        /* use another state annotation position array to save all markers for current image, when next image is clicked, then remove this array and s*/
    return (
      <>
        <h1>{coordinate.x}, {coordinate.y}</h1>
        <h2>Confidence {coordinate.confidence}</h2>
        <SaveMarkers markerList={markerList}/>
        <button onClick={RetrodetectController}>Show Retrodetect labels</button>
        <div className='ImageContainer'>
            <img ref={imgRef} src={props.image} onClick={clickHandler} alt='' style={{
                height: `${imageSize.viewHeight}px`,
                width: `${imageSize.viewWidth}px`,
                top: `${imageNewPosition.top}px`,
                left: `${imageNewPosition.left}px`,
              }}/>
            <DrawRetrodetectMarkers control={showRetrodetect} imageSize={imageSize} imagePosition={imageNewPosition}/>
            <DrawExistingMarkers markerList={markerList} imageSize={imageSize} imagePosition={imageNewPosition} />
    
        </div>
      </>
    )
}

export default Image