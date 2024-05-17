{/* https://www.coursera.org/learn/react-basics/supplement/KGYDt/javascript-modules-imports-exports*/}
export default function ButtonShiMin({text, isShiMin, count, setCount}) {

    function handleClick() {
        if (isShiMin == 'true'){
            setCount(count + 1)
        } else {
            setCount(count + 2)
        }
    }

    return (
        <div>
            <button onClick={handleClick}>
                {text} {count}
            </button>
        </div>
    );
}

