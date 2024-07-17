import { useEffect, useState } from "react";
import SessionList from "./SessionList";
/*
The list of bee tracking photo data capture sessions.
*/
function Sessions() {
  // TODO use global variable for backend URL
  const url = "/api/sessions/list";

  // Define the list of sessions
  const [sessions, setSessions] = useState([]);

  // Define a function to get the list of sessions
  const fetchSessions = async () => {
    fetch(url)
      .then((response) => response.json())
      .then((sessionsList) => {
        setSessions(sessionsList);
      })
      .catch((error) => console.log(error));
  };

  // Get sessions asynchronously (in the background)
  useEffect(() => {
    fetchSessions();
  }, []); //TODO: need to add cleanup code so it won't keep requesting from the backend, not sure what I added is correct

  // Render a drop-down list of session names
  return (
    <>
      <SessionList data={sessions} />
    </>
  );
}

export default Sessions;
