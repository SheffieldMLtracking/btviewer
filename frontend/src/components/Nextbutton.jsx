export default function NextButton(props) {
    console.log(props.current_status)
    function handleClick() {
            current_status = props.current_status + 3
    }

    return (
        <div>
            <button onClick={handleClick}>
                props.list[current_status]
                current_status
                
            </button>
        </div>
    );
}
