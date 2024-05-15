export default function NextButton({list,current_status}) {

    function handleClick() {
            current_status = current_status + 1
    }

    return (
        <div>
            <button onClick={handleClick}>
                {list[current_status]}
                
            </button>
        </div>
    );
}
