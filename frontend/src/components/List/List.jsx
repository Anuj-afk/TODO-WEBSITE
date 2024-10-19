import React, {useState, useEffect, useRef} from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./List.css"
import AxiosInstance from "../axios"

const List = () => {
    const itemref = useRef(null)
    const [addable, setAddable] = useState(false);
    const [count, setcount] = useState();
    const [toEdit, settoEdit] = useState(false);
    const [todo, setTodo] = useState([]);

    const fetchTasks = async () =>{
        try{
            let url = "/Todo_app/getListTask";
            const res = await AxiosInstance.get(url)
    
            const TasksJson = await res.data;
            
            if(TasksJson.completed){
                console.log(TasksJson.tasks);
                setTodo(TasksJson.tasks)
            }
            else if(!TasksJson.completed){
                console.log(TasksJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    }

    const addTasks = async () =>{
        const value = document.getElementById("Title").value;
        try{
            let url = "/Todo_app/addTaskList";
            const res = await AxiosInstance.post(url,
                JSON.stringify({
                    "desc": value,
                    "id": sessionStorage.getItem("index"),
                })
            )

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
            console.error(error);
        }
    }

    const editTasks = async (index) =>{
        const value = document.getElementById("editTitle").value;
        try{
            let url = "/Todo_app/editTaskList";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "desc": value,
                    "completed": false,
                    "index": index,
                })
            )

            const editJson = await res.data;

            if(editJson.updated){
                settoEdit(false);
                fetchTasks();
            }
            else if(!editJson.updated){
                console.log(editJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    }

    const completeTask = async (index) =>{
        try{
            let url = "/Todo_app/completeTaskList";
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
            console.error(error);
        }
    }

    const deleteTask = async (index) =>{
        try{
            let url = "/Todo_app/deleteTaskList"
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
            console.error(error);
        }
    }

    const edit_list_title = async () =>{
        let index = sessionStorage.getItem("index");
        try{
            let url = "/Todo_app/editTitle";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "index": index,
                    "title": itemref.current.value,
                })
            )

            const editTitleJson = await res.data;
            if(editTitleJson.edited){
                sessionStorage.setItem("title", itemref.current.value);
            }
            else{
                console.log(editTitleJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    }


    useEffect(() => {
        fetchTasks()
        itemref.current.focus();  
    }, [])

    const setfn = (index) => {
        settoEdit(true);
        setcount(index);
    }
    let title = sessionStorage.getItem("title")
    return (
        <div className="body" >
            <Sidebar></Sidebar>
            <div className="separator"></div>
            <div className="content">
                <h1 class = "Title">
                    <input ref = {itemref} onChange = {edit_list_title} defaultValue={title} maxLength={20}></input>
                </h1>
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
                            
                            else if (todo.tasks == sessionStorage.getItem("index")){
                                return(
                                    <div key = {todo.id} className = "task-area">
                                        <li >
                                            <input type="checkbox" className="checkbox" id = {index} onChange={() => {completeTask(todo.id);}} checked = {todo.competed}/>{' '}
                                            <span class = {todo.competed?"completed-task": ""}>{todo.description}</span>
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

export default List;