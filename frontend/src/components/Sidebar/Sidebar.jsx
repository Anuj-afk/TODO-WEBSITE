import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import Offcanvas from "../Offcanvas/Offcanvas";
import AxiosInstance from "../axios";

const Sidebar = () => {
    const [List, setList] = useState([]);

    const Title = (index, title) => {
        sessionStorage.setItem("index", index);
        sessionStorage.setItem("title", title);
        console.log(document.getElementById("List1").innerText);
    }

    const fetchList = async () =>{
        try{
            let url = "/Todo_app/getList";
            const res = await AxiosInstance.get(url)
    
            const ListJson = await res.data;
            
            if(ListJson.completed){
                setList(ListJson.tasks)
            }
            else if(!ListJson.completed){
                console.log(ListJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const addList = async () =>{
        try{
            let url = "/Todo_app/addList";
            const res = await AxiosInstance.post(url)
            const addJson = await res.data;
            
            if(addJson.added){
                console.log("added List");
                fetchList();
            }
            else if(!addJson.added){
                console.log(addJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const deleteList = async (id) =>{
        try{
            let url = "/Todo_app/deleteList";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    "index": id,
                }),
            )
            const deleteJson = await res.data;
            
            if(deleteJson.deleted){
                console.log("Deleted List");
                fetchList();
            }
            else if(!deleteJson.deleted){
                console.log(deleteJson.error);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="sidebar">
            <div className="profile">
                <img src="..\..\..\static\User.png" alt="Profile" />
            </div>

            <div className="todo">
                <h2 className="Todo-label">TODO</h2>
                <hr />
                <ul>
                    <li>
                        <i className="fas fa-calendar-alt icon"></i>
                        <a
                            href="/Today"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Today
                        </a>
                    </li>
                    <li>
                        <i className="fas fa-calendar icon"></i>
                        <a
                            href="/Upcoming"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Upcoming
                        </a>
                    </li>
                    <li>
                        <i className="fas fa-trophy icon"></i>
                        <a
                            href="/Completed"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Completed
                        </a>
                    </li>
                    <li>
                        <i className="fas fa-times-circle icon"></i>
                        <a
                            href="/Missed"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Missed
                        </a>
                    </li>
                    <li
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#taskPanel"
                        aria-controls="taskPanel"
                    >
                        <i className="fas fa-plus icon"></i>
                        <span>Add Task</span>
                    </li>
                </ul>
            </div>

            <div className="list">
                <h2 className="List-label">LIST</h2>
                <hr />
                <ul>
                    {List.map((list, index) => {
                        return(
                            <li id = "Lists" key={index}>
                                <a
                                    href="/List"
                                    style={{ textDecoration: "none", color: "black" }}
                                    onClick={() => Title(list.id, list.title)}
                                >
                                    <i className="fas fa-list icon"></i>
                                    <span id = "List1">{list.title}</span>
                                </a>
                                <i className="fas fa-trash" onClick={() => deleteList(list.id)}></i>
                            </li>
                        )
                    })}
                    <li  type = "button" onClick={() => addList()}>
                        <i className="fas fa-plus icon"></i>
                        <span>Add List</span>
                    </li>
                </ul>
            </div>
            <Offcanvas></Offcanvas>
        </div>
    );
};

export default Sidebar;
