/*
Save labels-
//NOT in used
Send the labels to the backend
*/
function SaveMarkers(markerList, photoPath) {
        //const photo_path = '1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np';
        const photo_path = photoPath
        const source = 'btviewer';
        const version = '0.0.0'
        const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;

        fetch(url, {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(markerList)
        })
            .then((response) => {
                console.log(JSON.stringify(response.json()));
            })
            .catch((err) => {
                console.log(err.response.data)
            })
   }
    
