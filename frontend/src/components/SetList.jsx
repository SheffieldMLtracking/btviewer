import { useState } from "react";
import { GetCurrentSubdirectory } from "./utils";
import DeviceList from "./DeviceList";
/*
Display a drop-down list of sessions for navigation.
*/
function SetList({ data, subdirectory }) {
  let [currentSet, setCurrentSet] = useState("");
  let [selectedSubdirectory, setSelectedSubdirectory] = useState("")
  let listDisplayed

if (typeof(data)==="string"){ //when there is nth in the data, especially when the app is first booted out
    listDisplayed=(
      <option>
        No item
      </option>
    )
} else if (data.length>0){
  const setNames = data.map(GetCurrentSubdirectory);

  listDisplayed = setNames.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ))
}
//   /*
//     When the user selects a session, save it.
//     */
  function changeHandler(e) {
    let selectedSet = e.target.value;
    console.log(selectedSet)
    // Update the list of photo filenames available in that session
    let url = `/api/sessions/${subdirectory}/${selectedSet}`;
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrentSet(data));
    console.log(data)
    const subdirectoryJoined = `${subdirectory}/${selectedSet}`
    setSelectedSubdirectory(subdirectoryJoined)
  }

  return (
    <>
      <label>Set</label>
      <select name="set" id="set" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>
      <DeviceList data={currentSet} subdirectory={selectedSubdirectory}/>
    </>
  );
}

export default SetList;
