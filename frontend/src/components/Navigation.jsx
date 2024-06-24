function Navigation ({photoPath}){


    function nextPhoto(){
        console.log(photoPath)
    }

    function previousPhoto(){
        console.log(photoPath)
    }
    return (
        <>
        <button onclick={nextPhoto}>Next</button>
        <button onclick={previousPhoto}>Previous</button>

        </>
    )
}

export default Navigation