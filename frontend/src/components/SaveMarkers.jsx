function SaveMarkers (props) {

    

    function handleSubmit (e) {
        e.preventDefault();
        const url = 'http://localhost:5000/labels/create';

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(props.markerList)
        })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err.response.data)
            })


      }
    
    


    return(
        <>
        <button onClick={handleSubmit}>Save</button>
        </>
    )

}
export default SaveMarkers