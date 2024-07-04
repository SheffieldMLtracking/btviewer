import { useState } from "react";
import Image from "./Image";

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection({ photoFilenames }) {
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [humanLabel, setHumanLabel] = useState([]);
  const [retrodetectLabel, setRetrodetectLabel] = useState([]);
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

    // Update the list of photo filenames available in that session
    let urlJpeg = "/api/photos/" + selectedPhoto.replace("np", "jpeg");
    setCurrentPhoto(urlJpeg);
    console.log(currentPhoto);

    // Get the json for the human label coordinates if it exists
    let urlLabel = "/api/labels/detail?path=" + selectedPhoto;
    console.log("urlLabel");
    console.log(urlLabel);
    fetch(urlLabel)
      .then((response) => response.json())
      .then((data) => {
        setHumanLabel(data);
    });
    //console.log(data);
    //console.log(humanLabel);
  }

  function handleNextPhoto() {
    setPhotoPath("2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.np")
    let urlJpeg = "/api/photos/2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.jpeg"
    setCurrentPhoto(urlJpeg);
    let urlLabel = "/api/labels/detail?path=2020-01-01/set_A/device_1/camera_1/20200101_094359.123456_000002.np"
    fetch(urlLabel)
      .then((response) => response.json())
      .then((data) => {
        setHumanLabel(data);
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

      <Image
        image={currentPhoto}
        humanLabel={humanLabel}
        photoPath={photoPath}
        handleNextPhoto={handleNextPhoto}
        handlePreviousPhoto={handlePreviousPhoto}
      />
      {/* pass function (nextPhoto & previsouPhoto that handles navigation of photo to image */}
    </>
  );
}

export default PhotoSelection;
