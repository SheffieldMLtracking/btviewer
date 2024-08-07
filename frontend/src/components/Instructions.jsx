function Instructions() {
  return (
    <>
      <h1>Btviewer</h1>
      <h4>Tagging</h4>
      <p>Confident tag: mouseclick + ctrl</p>
      <p>Unconfident tag: mouseclick + shift</p>
      <p>Annotate tag: After tagging, right click for input popup and enter to save/close. It will replace existing annotation if there is any.</p>
      <p>Delete ALL tags: ctrl + d </p>
      <p>Delete single tags: double left mouseclick around the tag</p>
      <p>Show/Hide Retrodetect: ctrl + r</p>
      <p>Show/Hide Annotation: ctrl + e</p>
      <h4>Zoom</h4>
      <p>Zoom In: mouseclick + alt</p>
      <p>Zoom Out: mouseclick + windows/cmd</p>
      <p>Reset Zoom: ctrl + q </p>
      <p>
        You can drag the image after zooming in by moving the mouse pointer
        while keeping left-click
      </p>
      <h4>Photo Navigation</h4>
      <p>Previous Photo: ctrl + a</p>
      <p>Skip to the previous 10th Photo: ctrl + z </p>
      <p>Next Photo: ctrl + s</p>
      <p>Skip to the next 10th Photo: ctrl + x </p>

  
    </>
  );
}
export default Instructions;
