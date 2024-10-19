import React, {useEffect, useState} from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./Completed.css"
import flatpickr from "flatpickr";
import AxiosInstance from "../axios.jsx";

const Completed = () => {
    const [count, setcount] = useState();
    const [toEdit, settoEdit] = useState(false);
    const [todo, setTodo] = useState([]);
    const fetchTasks = async (date) =>{
        try{
            let url = "/Todo_app/getCompletedTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "date": date,
                })
            )
    
            const TasksJson = await res.data;
            
            if(TasksJson.completed){
                setTodo(prev => [...prev, ...TasksJson.tasks])
            }
            else if(!TasksJson.completed){
                console.log(TasksJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const editTasks = async (todo, index) =>{
        try{
            const value = document.getElementById("editTitle").value;
            let url = "/Todo_app/editTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "title": value,
                    "completed": false,
                    "index": todo.id,
                })
            )
    
            const editJson = await res.data;
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
            console.log(error);
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
            console.log(error);
        }
    }

    const completeTask = async (todo, index) =>{
        try{
            let url = "/Todo_app/completeTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "completed": true,
                    "index": todo.id,
                })
            )
            const completeJson = await res.data;
            if(completeJson.completed){
                setTodo(prevTodos => 
                    prevTodos.map((task, i) => 
                        i === index ? { ...task, completed: false } : task // Set completed to true for the matched task
                    )
                );
            }
            else{
                console.log(completeJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect( async () => {
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;

        flatpickr(document.getElementById("datePicker"), {
            defaultDate: currentDate,
            enableTime: false,
            dateFormat: "d-m-Y",
            onChange: () => {
                document.getElementById(document.getElementById("datePicker").value).scrollIntoView();
            }
        });
        for(let i = 0; i <= 100; i++){
            const tempDate = new Date(date)
            tempDate.setDate(date.getDate() - 50 + i);
            let day = tempDate.getDate();
            let month = tempDate.getMonth() + 1;
            let year = tempDate.getFullYear();
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
                <h1>Completed</h1>
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
                            else if(todo.completed === true){
                                if(allDate !== todo.date){
                                    allDate = todo.date
                                    month = months[parseInt(allDate.slice(5,7)) - 1]
                                    day = allDate.slice(8,10)
                                    year = allDate.slice(0, 4)
                                    id = day + "-" + allDate.slice(5,7) + "-" + year

                                    return(
                                        
                                        <div key = {todo.id} className = "task-area">
                                            <div className="dateArea">
                                                <h5 id = {id}>{day}-{month}-{year}</h5>
                                                <hr></hr>
                                            </div>
                                            <li >
                                                <input type="checkbox" className="checkbox" id = {index} onChange={() => completeTask(todo, index)} checked/>{' '}
                                                <span style={{textDecoration: "line-through", textDecorationThickness: "2px"}}>{todo.title}</span>
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
                                            <input type="checkbox" className="checkbox" id = {index} onChange={() => completeTask(todo, index)} checked/>{' '}
                                            <span style={{textDecoration: "line-through", textDecorationThickness: "2px"}}>{todo.title}</span>
                                            <i class="fas fa-edit" id = "edit" onClick={() => setfn(index)}></i>
                                            <i class="fas fa-plus icon" id = "delete" onClick={() => deleteTask(todo, index)}></i>
                                        </li>
                                    </div>
                                )

                            }
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Completed;