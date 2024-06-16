import {useEffect, useState} from 'react'

/*
The list of bee tracking photo data capture sessions.
*/
function Sessions() {
    // TODO use global variable for backend URL
    const url = 'http://localhost:5000/sessions/';

    // Define the list of sessions
    const [sessions, setSessions] = useState([]);

    // Define a function to get the list of sessions
    const fetchSessions = async () => {
        fetch(url)
            .then(response => response.json())
            .then((sessionsList) => {
                setSessions(sessionsList)
            })
            .catch((error) => console.log(error));
    }

    // Get sessions asynchronously (in the background)
    useEffect(() => {
        fetchSessions();
    });//TODO: need to add REMOVE so it won't keep requesting from the backend

    // Render a drop-down list of session names
    return (<>{sessions}</>)
}

export default Sessions;
