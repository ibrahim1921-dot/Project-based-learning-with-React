import React, {useState} from 'react';
function MyComponent () {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("")

    //Function to add a task
    const addTask = () => {
        const text = newTask.trim();
        if (!text) return;
        setTasks(c => [...c, { id: Date.now(), text, completed: false }]);
        setNewTask("");
    };
    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    }

    //Function to delete a task
    const handleDeleteTask = (index) => {
        //Logic to delete task
        setTasks(c => c.filter((task, i) => i !== index));
    }
    //Implement todo completed
    const handleToggleComplete = (index) => {
        setTasks(c => c.map((task, i) => i === index ? {...task, completed: !task.completed} : task));
    }

    //handle task movement
    const handleMoveUpTask = (index) => {
        if (index === 0) return; // Can't move up the first item
        setTasks(c => {
            const newTasks = [...c];
            [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
            return newTasks;
        });
    }

    //handle task movedown
    const handleMoveDownTask = (index) => {
        if (index >= tasks.length-1) return; //Can't move down
        setTasks (c=> {
            const newTasks = [...c];
            [newTasks[index], newTasks[index+1]] = [newTasks[index+1], newTasks[index]]
            return newTasks; 
        })
    }
    
    const isAddDisabled = newTask.trim().length === 0;
    
    return (
        <>
        <h1>TO-DO-LIST</h1>
        <div>
            <input className='inputBox' type="text" 
            id='input-task' 
            placeholder='add task...'
            value={newTask}
            onChange={handleInputChange}
            onKeyDown={(e) => {if (e.key === "Enter" && !isAddDisabled) addTask()}} />
            <button className='add-button' onClick={addTask} disabled={isAddDisabled}>Add Task</button>
    
        </div>
        <ul>
        {tasks.map((task, index) => (
            <li key={task.id}>
                <div className='task-item'>
                <input className='checkbox'
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(index)}
                    aria-label={task.completed ? `Mark ${task.text} not completed` : `Mark ${task.text} completed.`}
                />
                <span
                    className='text'
                    style={{
                        textDecoration: task.completed ? "line-through" : "none",
                        opacity: task.completed ? 0.6 : 1,
                        marginLeft: "8px"
                    }}
                >
                    {task.text}
                </span>
                </div>
                <div className='task-actions'>
                <button className="move-up-btn" onClick={() => handleMoveUpTask(index)}>UP</button>
                <button className="move-down-btn" onClick={() => handleMoveDownTask(index)}>DOWN</button>
                <button onClick={() => handleDeleteTask(index)} className="delete-btn">X</button>
                </div>
            </li>
        ))}
        </ul>
        </>
    )

}
export default MyComponent;