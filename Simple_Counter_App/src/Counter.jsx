import React, { useState } from "react";
function Counter() {
    const [count, setCount] = useState(0);

    // function to increase count
    const increaseCount = () => setCount(c =>c + 1);

    //function to decrease count
    const decreaseCount = () => setCount (c => c - 1);

    //function to reset count
    const resetCount = () => setCount (0);
    return (
        <>
        <h1>Count</h1>
        <h2>{count}</h2>
        <button className="btn1" onClick={increaseCount}>Increase</button>
        <button className="btn2" onClick={decreaseCount}>decrease</button>
        <button className="btn3" onClick={resetCount}>Reset</button>
        </>
    );
}
export default Counter;