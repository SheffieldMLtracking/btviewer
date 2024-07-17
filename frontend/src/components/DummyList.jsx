import { useState } from "react";
import SetList from "./SetList";

/*
Display a drop-down list of sessions for navigation.
*/
function DummyList({ data }) {
  // Store the selected session name
  let [currentSession, setCurrentSession] = useState("");
  let [selectedSession, setSelectedSession] = useState("")
  console.log('dummy')
  console.log(data)
  console.log(typeof(data))
  let listDisplayed = data.map((item) => (
    <option key={item.id} value={item}>
      {item}
    </option>
  ));


  /*
    When the user selects a session, save it.
    */
  function changeHandler(e) {
    let selected = e.target.value;
    setSelectedSession(selected)
   
    // Update the list of photo filenames available in that session
    let url = `/api/sessions/${selected}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrentSession(data));
  }

  return (
    <>
      <h1>Sessions</h1>
      <select name="session" id="session" onChange={changeHandler}>
        <option />
        {listDisplayed}
      </select>
      <p>{selectedSession}</p>
      <p>{currentSession}</p>
      <SetList data={currentSession} subdirectory={selectedSession}/>
    </>
  );
}

export default DummyList;
