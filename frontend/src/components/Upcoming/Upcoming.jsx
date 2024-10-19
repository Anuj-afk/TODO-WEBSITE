import React, {useEffect, useState} from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Upcoming.css"
import flatpickr from "flatpickr";
import Offcanvas from "../Offcanvas/Offcanvas";
import AxiosInstance from "../axios";



const Upcoming = () => {
    const [addable, setAddable] = useState();
    const [Lastaddable, setLastAddable] = useState(false);
    const [count, setcount] = useState();
    const [toEdit, settoEdit] = useState(false);
    const [todo, setTodo] = useState([]);

    const fetchTasks = async (date) =>{
        try{
            let url = "/Todo_app/getTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "date": date,
                })
            )
    
            const TasksJson = await res.data
            
            if(TasksJson.completed){
                setTodo(prev => [...prev, ...TasksJson.tasks])
            }
            else if(!TasksJson.completed){
                console.log(TasksJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    }

    const addTasks = async (date) => {
        try{
            const value = document.getElementById("Title").value; // Get the task title
            let url = "/Todo_app/addTask";
            
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "title": value,
                    "description": null,
                    "date": date,
                    "completed": false,
                })
            );
        
            const addJson = await res.data;
            
            if (addJson.added) {
                console.log("Task added successfully");
        
                // Add the new task to the `todo` state in the correct position
                const newTask = {
                    id: addJson.id,  // Use the returned ID here
                    title: value,
                    description: null,
                    date: date,
                    completed: false,
                };
        
                setTodo(prevTodos => {
                    // Insert the new task and then sort the array by date
                    const updatedTodos = [...prevTodos, newTask];
        
                    // Sort tasks by date
                    updatedTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
        
                    return updatedTodos;
                });
        
                setAddable(-1);
                setLastAddable(false);
        
                // Clear the input field after successful addition
                document.getElementById("Title").value = "";
            } else {
                console.log(addJson.error);
            }
        }
        catch(error) {
            console.error(error);
        }
    };

    const editTasks = async (task, index) =>{
        try{
            const value = document.getElementById("editTitle").value;
            let url = "/Todo_app/editTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "title": value,
                    "completed": false,
                    "index": task.id,
                })
            )
    
            const editJson = await res.data

            if(editJson.edited){
                console.log("added");
                setTodo(prevTodos => 
                    prevTodos.map((t, i) => 
                        i === index ? { ...t, title: value } : t
                    )
                );
                settoEdit(false);
            }
            else if(!editJson.edited){
                console.log(editJson.error);
            }
        }
        catch(error){
            console.error(error);
        } 
    }

    const completeTask = async (task, index) =>{
        try{
            let url =  "/Todo_app/completeTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "completed": true,
                    "index": task.id,
                })
            )

            const completeJson = await res.data
            if(completeJson.completed){
                setTodo(prevTodos => 
                    prevTodos.map((task, i) => 
                        i === index ? { ...task, completed: true } : task // Set completed to true for the matched task
                    )
                );
            }
            else{
                console.log(completeJson.error);
            }
        }
        catch(error){
            console.error(error);
        }

    }

    const deleteTask = async (todo, index) =>{
        try{
            let url = "/Todo_app/delTask"
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "index": todo.id,
                })
            )
    
            const delJson = await res.data;
            if(delJson.deleted){
                console.log("deleted");
                setTodo(prevTodos => prevTodos.filter((_, i) => i !== index));
            }
            else{
                console.log(delJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    }

    useEffect( async () => {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;
        document.getElementById('taskDate').setAttribute('min', new Date().toISOString().slice(0, 10));
        flatpickr(document.getElementById("datePicker"), {
            defaultDate: currentDate,
            enableTime: false,
            dateFormat: "d-m-Y",
            onChange: () => {
                document.getElementById(document.getElementById("datePicker").value).scrollIntoView();
            }
        });
        for(let i = 0; i < 365; i++){
            date.setDate(date.getDate() + 1)
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let currentDate = `${day}-${month}-${year}`;
            await fetchTasks(currentDate);
        }
    }, []);
    
    const setfn = (index) => {
        settoEdit(true);
        setcount(index);
    }
    let allDate = null;
    let month = null;
    let day = null;
    let year = null;
    let id = null;
    let months = ['January', "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let date = [];
    return(
        <div className="body">
            <Sidebar></Sidebar>
            <div className="separator"></div>
            <div className="content">
                <h1>Upcoming</h1>
                <div className="date">
                    <input type="text" id="datePicker" placeholder="Select Date"/>               
                </div>
                <div className="task-list">
                    <ul id = "task-list">
                        {todo.map((todo, index) => {
                            date[index] = todo.date;
                            if(toEdit && index === count){
                                if(allDate !== todo.date){
                                    allDate = todo.date
                                    month = months[parseInt(allDate.slice(5,7)) - 1]
                                    day = allDate.slice(8,10)
                                    year = allDate.slice(0, 4)
                                    id = day + "-" + allDate.slice(5,7) + "-" + year
                                    return(
                                        <div key = {todo.id} className = "task-area">
                                            {addable === index && index >=1 && (
                                                <li id="new-today-task">
                                                    <form onSubmit={(e) => {e.preventDefault(); addTasks(date[index - 1]);}}>
                                                        <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => setAddable(-1)} ></i>
                                                        <input type="text" className="task-input" placeholder="Title" id = "Title" required />
                                                        <button className="add-btn" type="submit">Add</button>
                                                    </form>
                                                    <hr id="new-task-hr" />
                                                </li>
                                            )}
                                            {addable !== index && index >=1 &&  (
                                                <li className="add-task">
                                                    <i className="fas fa-plus-circle" onClick={() => setAddable(-1)}></i>
                                                    <span className="add-task-text" onClick={() => setAddable(-1)}>ADD</span>
                                                </li>
                                            )}
                                            <div className="dateArea">
                                                <h5 id = {id}>{day}-{month}-{year}</h5>
                                                <hr></hr>
                                            </div>
                                            <li id="new-today-task">
                                                <form onSubmit={(e) => {e.preventDefault(); editTasks(todo, index);}}>
                                                    <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => settoEdit(false)}></i>
                                                    <input type="text" className="task-input" placeholder="Title" id = "editTitle" required />
                                                    <button className="add-btn" type="submit">Edit</button>
                                                </form>

                                            </li>
                                    </div>
                                    )
                                }
                                return(
                                    <div key = {todo.id} className = "task-area">
                                        <hr />
                                        <li id="new-today-task">
                                            <form onSubmit={(e) => {e.preventDefault(); editTasks(todo, index);}}>
                                                <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => settoEdit(false)}></i>
                                                <input type="text" className="task-input" placeholder="Title" id = "editTitle" required />
                                                <button className="add-btn" type="submit">Edit</button>
                                            </form>

                                        </li>
                                    </div>
                                )

                            }
                            else if(todo.completed === false) {
                                if(allDate !== todo.date){
                                    allDate = todo.date
                                    month = months[parseInt(allDate.slice(5,7)) - 1]
                                    day = allDate.slice(8,10)
                                    year = allDate.slice(0, 4)
                                    id = day + "-" + allDate.slice(5,7) + "-" + year

                                    return(
                                        
                                        <div key = {todo.id} className = "task-area">
                                            {addable === index && index >=1 && (
                                                <li id="new-today-task">
                                                    <form onSubmit={(e) => {e.preventDefault(); addTasks(date[index - 1]);}}>
                                                        <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => setAddable(-1)} ></i>
                                                        <input type="text" className="task-input" placeholder="Title" id = "Title" required />
                                                        <button className="add-btn" type="submit">Add</button>
                                                    </form>
                                                    <hr id="new-task-hr" />
                                                </li>
                                            )}
                                            {addable !== index && index >=1 &&  (
                                                <li  id="new-today-task" className="add-task">
                                                    <i className="fas fa-plus-circle" onClick={() => setAddable(index)}></i>
                                                    <span className="add-task-text" onClick={() => setAddable(index)}>ADD</span>
                                                </li>
                                            )}
                                            <div className="dateArea">
                                                <h5 id = {id}>{day}-{month}-{year}</h5>
                                                <hr></hr>
                                            </div>
                                            <li >
                                                <input type="checkbox" className="checkbox" id = {index} onChange={() => completeTask(todo, index)}/>{' '}
                                                {todo.title}
                                                <i class="fas fa-edit" id = "edit" onClick={() => setfn(index)}></i>
                                                <i class="fas fa-plus icon" id = "delete" onClick={() => deleteTask(todo, index)}></i>
                                            </li>
                                        </div>
                                    )
                                }
                                return(
                                    <div key = {todo.id} className = "task-area">
                                        <hr></hr>
                                        <li >
                                            <input type="checkbox" className="checkbox" id = {index} onChange={() => completeTask(todo, index)}/>{' '}
                                            {todo.title}
                                            <i class="fas fa-edit" id = "edit" onClick={() => setfn(index)}></i>
                                            <i class="fas fa-plus icon" id = "delete" onClick={() => deleteTask(todo, index)}></i>
                                        </li>
                                    </div>
                                )

                            }
                        })}
                        {Lastaddable && todo.length > 0 &&(
                            <li id="new-today-task">
                                <form onSubmit={(e) => {e.preventDefault(); addTasks(date[date.length -1]);}}>
                                    <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => setLastAddable(false)} ></i>
                                    <input type="text" className="task-input" placeholder="Title" id = "Title" required />
                                    <button className="add-btn" type="submit">Add</button>
                                </form>
                                <hr id="new-task-hr" />
                            </li>
                        )}
                        {!Lastaddable && todo.length > 0 &&(
                            <li className="add-task">
                                <i className="fas fa-plus-circle" onClick={() => setLastAddable(true)}></i>
                                <span className="add-task-text" onClick={() => setLastAddable(true)}>ADD</span>
                            </li>
                        )}
                        {!Lastaddable && todo.length === 0 &&(
                            <li type="button" data-bs-toggle="offcanvas" data-bs-target="#taskPanel" aria-controls="taskPanel"className="add-task">
                                <i className="fas fa-plus-circle"></i>
                                <span className="add-task-text">ADD</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <Offcanvas></Offcanvas>
        </div>
    )
}

export default Upcoming;