export function SaveMarkers(point, photoPath) { //JS for  utilities functoin
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;
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
    console.log('delete')
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/api/labels/delete?path=${photo_path}&source=${source}&version=${version}`;

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

export function CompareCoordinates(targetX, targetY, list, range=100){
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

