import { useState } from "react";
import Image from "./Image";

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection({ photoFilenames }) {
  const [currentPhoto, setCurrentPhoto] = useState(""); //the path of the photo
  const [photoPath, setPhotoPath] = useState(""); //the selected value from the dropdownlist
  const [label, setLabel] = useState([]);
  //get the image original dimension
  const [imageDimension, setImageDimension] = useState({'width':0, 
                                                        'height':0})
  const [nextPhoto, setNextPhoto] =useState("");
  /*
    List the photos for users to choose from
    */
  let listDisplayed = photoFilenames.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ));

  /*
    When the user selects a photo, retrieve it to send to image component
    The photoFetcher send 3 things:
    1. the image
    2. the image dimension
    3. the json of label if exists
    */
  function photoFetcher(e) {
    let selectedPhoto = e.target.value;
    setPhotoPath(selectedPhoto);

    //SC:Did we fetch photo, it does not seems so, and I only submit the image source to the image.jsx
    let urlJpeg = "/api/photos/" + selectedPhoto.replace("np", "jpeg");
    setCurrentPhoto(urlJpeg);
    console.log('urlJpeg' + urlJpeg);

    //Get photo dimension
    let urlDimension = "/api/photos/dimension?path=" + selectedPhoto;
    fetch(urlDimension)
      .then((response) => response.json())
      .then((data)=>{
        setImageDimension({
          width: data.width,
          height: data.height,
        });

      })

    // Get the json for the human/retrodetect label coordinates if it exists
    let urlLabel = "/api/labels/detail?path=" + selectedPhoto;
    console.log("urlLabel");
    console.log(urlLabel);
    fetch(urlLabel)
      .then((response) => response.json())
      .then((data) => {
        setLabel(data);
      });
  }

  function handleNextPhoto(current_path) {
    const currentPath = current_path;
    const skip = 1;
    let url = `/api/photos/next?path=${currentPath}&skip=${skip}`;
    console.log("urlcurret photo in next");
    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setNextPhoto(data);
        let urlJpeg = "/api/photos/" + data.replace("np", "jpeg");
        setCurrentPhoto(urlJpeg);

      })
    
      
  }

  function handlePreviousPhoto() {
    console.log(photoPath);
  }

  return (
    <>
      <select name="photo" id="photo" onChange={photoFetcher}>
        <option />
        {listDisplayed}
      </select>
      <p>image source {currentPhoto}</p>
      <p>{photoPath}</p>
      <p>Next Photo{nextPhoto}</p>
      <Image
        image={currentPhoto}
        dimension={imageDimension}
        label={label}
        photoPath={photoPath}
        handleNextPhoto={handleNextPhoto}
        handlePreviousPhoto={handlePreviousPhoto}
      />
      {/* pass function (nextPhoto & previsouPhoto that handles navigation of photo to image */}
    </>
  );
}

export default PhotoSelection;
