import {useState} from 'react'

/*
Display a drop-down list of photos to be shown.
*/
function PhotoSelection (props) {


    let listDisplayed = props.data.map(item =>
        <option key={item.id} value={item}>{item}</option>);


    return(
        <>
            <select
                name="photo"
                id="photo"
            >
                <option/>
                {listDisplayed}</select>
        </>
    )
}
export default PhotoSelection