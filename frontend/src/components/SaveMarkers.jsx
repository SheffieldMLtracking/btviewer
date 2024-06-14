/*
Save labels

Send the labels to the backend
*/
function SaveMarkers(props) {

    function handleSubmit() {

        // eslint-disable-next-line no-unused-vars
        const photo_path = '1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np';
        const source = 'btviewer';
        const version = '0.0.0'
        const url = `/api/labels/create?path=${photo_path}&source=${source}&version=${version}`;

        fetch(url, {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(props.markerList)
        })
            .then((response) => {
                console.log(JSON.stringify(response.json()));
            })
            .catch((err) => {
                console.log(err.response.data)
            })


    }


    return (
        <>
            <button onClick={handleSubmit}>Save</button>
        </>
    )

}

export default SaveMarkers