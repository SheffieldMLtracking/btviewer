function ShowList (props){ // to be change to button click so as to send the list to the backend

    function mapping (item) {
        if (item!=null){
            return (
                <li>{item.x}{item.y}</li>
            )
        }
    }
    let recordedList = props.data.map(mapping)
        
    return(
        <>
        <ul>{recordedList}</ul>
        </>
    )
}
export default ShowList