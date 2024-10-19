import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Today.css";
import AxiosInstance from "../axios";

const Today = () => {
    const [addable, setAddable] = useState(false);
    const [count, setcount] = useState();
    const [toEdit, settoEdit] = useState(false);
    const [todo, setTodo] = useState([]);

    const fetchTasks = async () =>{
        let url = "/Todo_app/getTaskToday";
        try{
            const res = await AxiosInstance.get(url)
    
            const TasksJson = await res.data
            
            if(TasksJson.completed){
                console.log(TasksJson.tasks);
                setTodo(TasksJson.tasks)
            }
            else if(!TasksJson.completed){
                console.log(TasksJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const addTasks = async () =>{
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    let todaydate = mm + '/' + dd + '/' + yyyy;
    const value = document.getElementById("Title").value;
    let url = "/Todo_app/addTask";
    try{
        const res = await AxiosInstance.post(url, JSON.stringify({
            "title": value,
            "description": null,
            "date": todaydate,
            "completed": false,
        }))

        const addJson = await res.data;

        if(addJson.added){
            console.log("added");
            fetchTasks();
            setAddable(false);
        }
        else if(!addJson.added){
            console.log(addJson.error);
        }
    }
    catch(error){
        console.log(error)
    }

}
    const editTasks = async (index) =>{
        const value = document.getElementById("editTitle").value;
        try{
            let url = "/Todo_app/editTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "title": value,
                    "completed": false,
                    "index": index,
                })
            )
    
            const editJson = await res.data;
            if(editJson.edited){
                fetchTasks();
                settoEdit(false);
            }
            else if(!editJson.edited){
                console.log(editJson.error);
            }
        }
        catch(error){
            console.log(error)
        }       
    }

    const completeTask = async (index) =>{
        try{
            let url = "/Todo_app/completeTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "completed": true,
                    "index": index,
                })
            )
            const completeJson = await res.data;
            if(completeJson.completed){
                fetchTasks();
            }
            else{
                console.log(completeJson.error);
            }
    
        }
        catch(error){
            console.log(error);
        }
    }

    const deleteTask = async (index) =>{
        try{
            let url = "/Todo_app/delTask"
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "index": index,
                })
            )
            const delJson = await res.data;
            if(delJson.deleted){
                console.log("deleted");
                fetchTasks();
            }
            else{
                console.log(delJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [])

    const setfn = (index) => {
        settoEdit(true);
        setcount(index);
    }

    return (
        <div className="body" >
            <Sidebar></Sidebar>
            <div className="separator"></div>
            <div className="content">
                <h1>Today</h1>
                <div className="task-list">
                    <ul id = "task-list">
                        {todo.map((todo, index) => {
                            if(toEdit && index === count){
                                return(
                                    <div key = {todo.id} className = "task-area">
                                        <li id="new-today-task">
                                            <form onSubmit={(e) => {e.preventDefault(); editTasks(todo.id);}}>
                                                <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => settoEdit(false)}></i>
                                                <input type="text" className="task-input" placeholder="Title" id = "editTitle" required />
                                                <button className="add-btn" type="submit">Edit</button>
                                            </form>

                                        </li>
                                        <hr />
                                    </div>
                                )

                            }
                            else{
                                return(
                                    <div key = {todo.id} className = "task-area">
                                        <li >
                                            <input type="checkbox" className="checkbox" id = {index} onChange={() => {completeTask(todo.id);}}/>{' '}
                                            {todo.title}
                                            <i class="fas fa-edit" id = "edit" onClick={() => setfn(index)}></i>
                                            <i class="fas fa-plus icon" id = "delete" onClick={() => deleteTask(todo.id)}></i>
                                        </li>
                                        <hr></hr>
                                    </div>
                                )

                            }
                        })}

                        {addable && (
                            <li id="new-today-task">
                                <form onSubmit={(e) => {e.preventDefault(); addTasks();}}>
                                    <i className="fas fa-plus icon" style={{ marginRight: "8px", fontSize: "16px" , rotate: "45deg", cursor: "pointer"}} onClick={() => setAddable(false)} ></i>
                                    <input type="text" className="task-input" placeholder="Title" id = "Title" required />
                                    <button className="add-btn" type="submit">Add</button>
                                </form>
                                <hr id="new-task-hr" />
                            </li>
                        )}
                        {!addable && (
                            <li className="add-task">
                                <i className="fas fa-plus-circle" onClick={() => setAddable(true)}></i>
                                <span className="add-task-text" onClick={() => setAddable(true)}>ADD</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Today;
