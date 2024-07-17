import { useState } from "react";
import { GetCurrentSubdirectory } from "./utils";
import PhotoList from "./PhotoList";
import PhotoSelection from "./PhotoSelection";

/*
Display a drop-down list of sessions for navigation.
*/
function CameraList({ data, subdirectory }) {
  let [currentCamera, setCurrentCamera] = useState("");
  let [selectedSubdirectory, setSelectedSubdirectory] = useState("")
  let listDisplayed

if (typeof(data)==="string"){ //when there is nth in the data, especially when the app is first booted out
    listDisplayed=(
      <option>
        No item
      </option>
    )
} else if (data.length>0){
  const CameraNames = data.map(GetCurrentSubdirectory);

  listDisplayed = CameraNames.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ))
}
//   /*
//     When the user selects a session, save it.
//     */
  function changeHandler(e) {
    let selectedCamera = e.target.value;
    // Update the list of photo filenames available in that session
    let url = `/api/sessions/${subdirectory}/${selectedCamera}`;
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrentCamera(data));
    console.log(data)
    const subdirectoryJoined = `${subdirectory}/${selectedCamera}`
    setSelectedSubdirectory(subdirectoryJoined)
  }

  return (
    <>
      <h5>Camera</h5>
      <select name="device" id="device" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>

      <PhotoList data={currentCamera} subdirectory={selectedSubdirectory}/>

    </>
  );
}

export default CameraList;