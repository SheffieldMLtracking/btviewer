import {useState} from 'react'
import PhotoSelection from './PhotoSelection'
/*
Display a drop-down list of sessions for navigation.
*/
function ShowList(props) {
    // Store the selected session name
    let [currentSession, setCurrentSession] = useState('');
    let listDisplayed = props.data.map(item =>
        <option key={item.id} value={item}>{item}</option>);

    // The photos in that session
    let [photoFilenames, setPhotoFilenames] = useState([]);

    /*
    When the user selects a session, save it.
    */
    function changeHandler(e) {
        let selectedSession = e.target.value;
        setCurrentSession(selectedSession);
        console.log(selectedSession);

        // Update the list of photo filenames available in that session
        let url = `/api/sessions/${selectedSession}`;
        fetch(url)
            .then(response => response.json())
            .then(data => setPhotoFilenames(data));

       
    }

  

    return (
        <>
            <h1>Photo Selection</h1>
            <select
                name="session"
                id="session"
                onChange={changeHandler}
            >
                <option/>
                {listDisplayed}</select>
            <PhotoSelection data={photoFilenames}/>
        </>
    )

}

export default ShowList