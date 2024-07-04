export function SaveMarkers(point, photoPath) { //JS for  utilities functoin
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;
    //http://localhost:5000/labels/create?path=1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np


    console.log('in savemarkers function '+ point)
    console.log('url sent ' + url)
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