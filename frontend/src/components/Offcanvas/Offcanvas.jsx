import React , {useEffect} from "react";
import AxiosInstance from "../axios";

const Offcanvas = () =>{
    const addTasks = async () => {
        const value = document.getElementById("taskTitle").value;
        const date = document.getElementById("taskDate").value;
        const desc = document.getElementById("taskDescription").value;
        try{
            let url = "/Todo_app/addTask";
            const res = await AxiosInstance.post(url, 
                JSON.stringify({
                    title: value,
                    description: desc,
                    date: date,
                    completed: false,
                }),
            );
    
            const addJson = await res.data;
    
            if (addJson.added) {
                console.log("added");
                window.location.reload();
            } else if (!addJson.added) {
                console.log(addJson.error);
            }
        }
        catch(error){
            console.error(error);
        }
    };

    useEffect(() => {
        document.getElementById('taskDate').setAttribute('min', new Date().toISOString().slice(0, 10));
    },[])
    
    return(
    <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="taskPanel"
        aria-labelledby="taskPanelLabel"
        style={{ backgroundColor: "584B53" }}
    >
        <div class="offcanvas-header">
            <h1 class="offcanvas-title" id="taskPanelLabel">
                ADD TASK
            </h1>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
            ></button>
        </div>
        <div class="offcanvas-body">
            <div class="mb-3">
                <label for="taskDate">Select Date</label>
                <input
                    type="date"
                    class="form-control"
                    id="taskDate"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="taskTitle" class="form-label">
                    Title
                </label>
                <input
                    type="text"
                    class="form-control"
                    id="taskTitle"
                    placeholder="Title"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="taskDescription" class="form-label">
                    Description
                </label>
                <textarea
                    class="form-control"
                    id="taskDescription"
                    rows="3"
                    placeholder="Description"
                ></textarea>
            </div>
            <div
                class="offcanvas-footer"
                style={{
                    position: "absolute",
                    width: "95%",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
            >
                <button
                    class="btn btn-success w-100"
                    style={{ marginTop: "20px" }}
                    onClick={() => addTasks()}
                >
                    Save Task
                </button>
            </div>
        </div>
    </div>
    )
}

export default Offcanvas;