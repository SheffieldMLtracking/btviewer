export function SaveMarkers(point, photoPath) { //JS for  utilities functoin
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;
    console.log('in savemarkers function', point)
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