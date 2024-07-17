import { useState } from "react";
import { GetCurrentSubdirectory } from "./utils";
/*
Display a drop-down list of sessions for navigation.
*/
function PhotoList({ data, subdirectory }) {
  console.log('in photo list')
  console.log(data)
  let [currentPhoto, setCurrentPhoto] = useState("");
  let [selectedSubdirectory, setSelectedSubdirectory] = useState("")
  let listDisplayed

if (typeof(data)==="string"){ //when there is nth in the data, especially when the app is first booted out
    listDisplayed=(
      <option>
        No item
      </option>
    )
} else if (data.length>0){
  const PhotoNames = data.map(GetCurrentSubdirectory);

  listDisplayed = PhotoNames.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ))
}
//   /*
//     When the user selects a session, save it.
//     */
  function changeHandler(e) {
    let selectedPhoto = e.target.value;
    // Update the list of photo filenames available in that session
    let url = `/api/sessions/${subdirectory}/${selectedPhoto}`;
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrentPhoto(data));
    console.log(data)
    const subdirectoryJoined = `${subdirectory}/${selectedPhoto}`
    setSelectedSubdirectory(subdirectoryJoined)
  }

  return (
    <>
      <h5>Photo</h5>
      <select name="device" id="device" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>
      {/* <p>{currentPhoto}</p> */}
      <p>{selectedSubdirectory}</p>

    </>
  );
}

export default PhotoList;