import {useState} from 'react'
import Image from './Image';

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection(props) {
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

        console.log(selectedPhoto);

        // Update the list of photo filenames available in that session
        let url = `/api/${selectedPhoto}`;
        let urlJpeg = '/api/photos/' + selectedPhoto.replace("np", "jpeg");
        setCurrentPhoto(urlJpeg);

        console.log(currentPhoto)

    }


    return (
        <>
            <select
                name="photo"
                id="photo"
                onChange={photoFetcher}

            >
                <option/>
                {listDisplayed}</select>
            <Image image={currentPhoto}/>

        </>
    )
}

export default PhotoSelection