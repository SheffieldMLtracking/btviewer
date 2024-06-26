export function SaveMarkers(markerList, photoPath) { //JS for  utilities functoin
    //TODO: ask Yuliang how to move function to a util
    const photo_path = photoPath;
    const source = "btviewer";
    const version = "0.0.0";
    const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;

    fetch(url, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(markerList),
    })
      .then((response) => {
        console.log(JSON.stringify(response.json()));
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }