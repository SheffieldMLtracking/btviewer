function DrawMarker (props) { // current x and y based on the current view
  let colour
    if (typeof props !== 'undefined' && props !== null) {
      if (props.confidence === true){
        colour = 'red' 
      } else if (props.confidence === false)  {
        colour = 'blue'
      } else {
        colour = 'yellow'
      }
    return (
      <>
      <div style={{ //circle
        position: 'absolute',
        borderWidth: '1px', // Adjust border thickness as needed
        borderStyle: 'solid', // Adjust border style (e.g., dashed, dotted)
        borderColor: `${colour}`, // Adjust border color as needed
        backgroundColor: 'transparent', // Removes background color
        borderRadius: '50%',
        transform: `translate(${props.x}px, ${props.y}px)`,
        left: -10,
        top:-10,
        width: 20,
        height: 20,
        pointerEvents: `${props.pointer}`,

      }} 
      />
      <div style={{ //top verticle line
        position: 'absolute',
        backgroundColor: `${colour}`, 
        transform: `translate(${props.x}px, ${props.y}px)`,
        left: 0,
        top:-8,
        width: 2,
        height: 6,
        pointerEvents: `${props.pointer}`,

      }} 
      />
      <div style={{ //left horizontal line
        position: 'absolute',
        backgroundColor:`${colour}`, 
        transform: `translate(${props.x}px, ${props.y}px)`,
        left: -8,
        top:0,
        width: 6,
        height: 2,
        pointerEvents: `${props.pointer}`,

      }} 
      />
      <div style={{ //bottom verticle line
        position: 'absolute',
        backgroundColor: `${colour}`, 
        transform: `translate(${props.x}px, ${props.y}px)`,
        left: 0,
        top:4,
        width: 2,
        height: 6,
        pointerEvents: `${props.pointer}`,

      }} 
      />
      <div style={{ //right horizontal line
        position: 'absolute',
        backgroundColor: `${colour}`, 
        transform: `translate(${props.x}px, ${props.y}px)`,
        left: 4,
        top:0,
        width: 6,
        height: 2,
        pointerEvents: `${props.pointer}`,

      }} 
      />
      </>


    )
  }
}
export default DrawMarker