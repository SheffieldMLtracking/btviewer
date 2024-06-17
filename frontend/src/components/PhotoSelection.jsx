import {useState} from 'react'

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection (props) {
    const [currentPhoto, setCurrentPhoto] = useState('')
    /*
    List the photos for users to choose from
    */
    let listDisplayed = props.data.map(item =>
        <option key={item.id} value={item}>{item}</option>);

    /*
    When the user selects a photo, retrieve it to send to image component
    */
    function photoFetcher(e) {
        let selectedPhoto = e.target.value;
        setCurrentPhoto(selectedPhoto);
        console.log(selectedPhoto);

        // Update the list of photo filenames available in that session
        let url = `/api/${selectedPhoto}`;
        url = url.replace("np","jpeg")
        console.log(url)
        fetch(url)
        .then(response => response.json())
        .then(data => setCurrentPhoto(data));


    }



    return(
        <>
            <select
                name="photo"
                id="photo"
                onChange={photoFetcher}

            >
                <option/>
                {listDisplayed}</select>
                

        </>
    )
}
export default PhotoSelection