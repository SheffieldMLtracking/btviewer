import { useState } from "react";
import { GetCurrentSubdirectory } from "./utils";
import CameraList from "./CameraList";
/*
Display a drop-down list of sessions for navigation.
*/
function DeviceList({ data, subdirectory }) {
  let [currentDevice, setCurrentDevice] = useState("");
  let [selectedSubdirectory, setSelectedSubdirectory] = useState("")
  let listDisplayed

if (typeof(data)==="string"){ //when there is nth in the data, especially when the app is first booted out
    listDisplayed=(
      <option>
        No item
      </option>
    )
} else if (data.length>0){
  const DeviceNames = data.map(GetCurrentSubdirectory);

  listDisplayed = DeviceNames.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ))
}
//   /*
//     When the user selects a session, save it.
//     */
  function changeHandler(e) {
    let selectedDevice = e.target.value;
    console.log(selectedDevice)
    // Update the list of photo filenames available in that session
    let url = `/api/sessions/${subdirectory}/${selectedDevice}`;
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrentDevice(data));
    console.log(data)
    const subdirectoryJoined = `${subdirectory}/${selectedDevice}`
    setSelectedSubdirectory(subdirectoryJoined)
  }

  return (
    <>
      <label>Device</label>
      <select name="device" id="device" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>
      <CameraList data={currentDevice} subdirectory={selectedSubdirectory}/>

    </>
  );
}

export default DeviceList;