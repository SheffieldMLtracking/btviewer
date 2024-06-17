import { useState} from 'react'

function ShowList (props) {
    const [sessionData,setSessionData] = useState('0')
    const listDisplayed = props.data.map(item =>
        <option value={item.session}>{item.session}</option>)

    function changeHandler (e){
        let areaFound = props.data.filter((element) => element.areaName === e.target.value)
        setSessionData(
            sessionData[0]
        )
    }

    return(
         <>
        <h1>Photo Selection </h1>
        <select 
            name='session'
            id='session'
            onChange={changeHandler}
        >{listDisplayed}</select>
        </>
    )

}

export default ShowList