import { useState } from "react";
import Image from "./Image";

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection({ photoFilenames }) {
  const [currentPhoto, setCurrentPhoto] = useState(""); //the path of the photo
  const [photoPath, setPhotoPath] = useState(""); //the selected value from the dropdownlist
  const [label, setLabel] = useState([]);
  const [imageDimension, setImageDimension] = useState({'width':0, 
                                                        'height':0})
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

  function handleNextPhoto() {
    

    setPhotoPath(
      "2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.np"
    );
    let urlJpeg =
      "/api/photos/2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.jpeg";
    setCurrentPhoto(urlJpeg);
    let urlLabel =
      "/api/labels/detail?path=2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.np";
    fetch(urlLabel)
      .then((response) => response.json())
      .then((data) => {
        setLabel(data);
      });
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
