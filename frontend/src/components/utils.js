export function SaveMarkers(point, photoPath) { //JS for  utilities functoin
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/labels/create?path=${photo_path}&source=${source}&version=${version}`;
    //http://localhost:5000/labels/create?path=1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np

    console.log('photopath' + photo_path)
    fetch(url, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(point),
    })
      .then((response) => {
        console.log(JSON.stringify(response.json()));
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }
  
export function DeleteAllMarkers(photoPath){
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/labels/delete?path=${photo_path}&source=${source}&version=${version}`;

    fetch(url, {
      method: "delete",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        console.log(JSON.stringify(response.json()));
      })
      .catch((err) => {
        console.log(err.response.data);
      });
}

//Return the first existing label found within the range of 25 pixel of the clicked point in x and y in terms of original pixel of the photo
export function CompareCoordinates(targetX, targetY, list, range=25){ 
  for (const item of list) {
    // Check if the item has "x" and "y" keys
    if (item.hasOwnProperty('x') && item.hasOwnProperty('y')) {
      // Calculate absolute distance for both coordinates
      const distanceX = Math.abs(item.x - targetX);
      const distanceY = Math.abs(item.y - targetY);

      // Check if both distances are within the range
      if (distanceX <= range && distanceY <= range) {
        return item;  // Return the item if both conditions met
      }
    }
  }

  // If no item is found, return undefined
  return undefined;
}

export function DeleteSingleMarker(photoPath, coordinateX, coordinateY){
  const photo_path = photoPath;
  const source = "btviewer";
  const version = "0.0.0";
  const x = coordinateX;
  const y = coordinateY;
  const url = `/labels/modify?path=${photo_path}&source=${source}&version=${version}&x=${x}&y=${y}`;
  console.log(url)

  fetch(url, {
    method: "post",
    headers: { "Content-type": "application/json" },
  })
    .then((response) => {
      console.log(JSON.stringify(response.json()));
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}

export function SaveAnnotation(photoPath, annotation, coordinateX, coordinateY){
  const photo_path = photoPath;
  const source = "btviewer";
  const version = "0.0.0";
  const x = coordinateX;
  const y = coordinateY;
  const annotationText = annotation
  const url = `/labels/annotate?path=${photo_path}&source=${source}&version=${version}&x=${x}&y=${y}&annotation=${annotationText}`;
  console.log(url)

  fetch(url, {
    method: "post",
    headers: { "Content-type": "application/json" },
  })
    .then((response) => {
      console.log(JSON.stringify(response.json()));
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}

export function GetCurrentSubdirectory(filename){
  const parts = filename.split('/');
  // Assuming the name required is always the last part (adjust if needed)
  return parts[parts.length - 1];

}