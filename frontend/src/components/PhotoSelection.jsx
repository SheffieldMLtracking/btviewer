import {useState} from 'react'
import Image from './Image';

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection({photoFilenames}) {
    const [currentPhoto, setCurrentPhoto] = useState('')
    const [photoPath, setPhotoPath] = useState('')
    const [humanLabel, setHumanLabel] = useState([])
    /*
    List the photos for users to choose from
    */
    let listDisplayed = photoFilenames.map(item =>
        <option key={item.id} value={item}>{item}</option>);

    /*
    When the user selects a photo, retrieve it to send to image component
    */
    function photoFetcher(e) {
        let selectedPhoto = e.target.value;

        setPhotoPath(selectedPhoto);

        // Update the list of photo filenames available in that session
        let urlJpeg = '/api/photos/' + selectedPhoto.replace("np", "jpeg");
        setCurrentPhoto(urlJpeg);
        console.log(currentPhoto)

    // Get the json for the human label coordinates if it exists
    let urlLabel = '/api/labels/detail?path=' + selectedPhoto
    console.log('urlLabel')
    console.log(urlLabel)
    fetch(urlLabel)
        .then(response => response.json())
        .then((data) => {
            setHumanLabel(data)
        });
    console.log(data)
    console.log(humanLabel)

    }


    function nextPhoto(){
        console.log(photoPath)
    }

    function previousPhoto(){
        console.log(photoPath)
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
            <button onclick={nextPhoto}>Next</button><button onclick={previousPhoto}>Previous</button>
            <Image image={currentPhoto} humanLabel={humanLabel} photoPath={photoPath}/>
            {/* pass function (nextPhoto & previsouPhoto that handles navigation of photo to image */}

        </>
    )
}

export default PhotoSelection