/*
Save labels

Send the labels to the backend
*/
function SaveMarkers(props) {

    function handleSubmit() {
        const url = '/api/labels/create';

        fetch(url, {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(props.markerList)
        })
            .then((response) => {
                console.log(response);
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