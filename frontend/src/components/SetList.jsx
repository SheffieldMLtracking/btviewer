import { useState } from "react";
import { GetCurrentSubdirectory } from "./utils";
/*
Display a drop-down list of sessions for navigation.
*/
function SetList({ data, subdirectory }) {
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
   
//     // Update the list of photo filenames available in that session
//     let url = `/api/sessions/sets/${selectedSet}`;
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => setCurrentSet(data));
  }

  return (
    <>
      <h1>Set</h1>
      <select name="session" id="session" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>
    </>
  );
}

export default SetList;
