import { useState } from "react"
/* For handling fetching a quote from the quote API */
import { useEffect } from "react"    
// import icons:
import { BookmarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";


const App = () => {

  // State for handling the tasks
  // Since I want to add checkboxes to each task,
  // this "tasks" state value will not just be an array storing
  // each task, now it will store an object 
  // (containing the text of the task and a boolean 
  // to see if the task is completed or not)
  // The "task" state value remains the same:
  //  - It will continue to store the text of the task inputted by the user
  const [tasks, setTasks] = useState([]); 
  const [task, setTask] = useState("");

  /* State for handling the editing of tasks */
  // Index of the task being edited
  //    -1 means no task is being editted
  const [editTaskId, setEditTaskId] = useState(-1);
  // Task currently being editted
  const [editTask, setEditTask] = useState("");

  // State for handling the inspirational quotes
  // at the bottom of the page:
  // This is the state to store the quote when fetched
  const [quote, setQuote] = useState("");





  /*********    FUNTIONS:   ***********/
  // Function to add tasks to the task array
  const addTasks = () => {
    // If the task is not empty
    if(task !== "") {
      // Before adding the task to the tasks array, 
      // we want to make it an object with text and bool
      const newTask = { text: task, completed: false};
      // Add the task object to the tasks array
      setTasks([...tasks, newTask]);
      // Reset the task state
      setTask("");

      // Test
      console.log(tasks);

      // Save updated tasks to localStorage
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
    }
  }



  // Function to delete task:
  const deleteTasks = (index) => {

    // Create a copy of the tasks array
    // This is done to avoid directly modifying the state
    // This is a good practice in React
    // Another way to do it:
    //      const newTasks = [...tasks];
    // The spread operator ... returns a copy of the array too
    const newTasks = tasks.slice();

    // Remove the task at the index
    // Use splice instead of delete, coz splice takes out the element
    // The 1 in the 2nd parameter is how many elements you want to
    // delete each time this func is called
    // NOTE: if you dont define the second param, if you try to delete
    //      the top task, it will delete all of them 
    newTasks.splice(index, 1);

    // Update the tasks array
    setTasks(newTasks);

    // Save updated tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }





  // Function to edit task:
  const editTasks = (index) => {
    // Set the task to be edited
    // Specifically get the text portion of the task object
    setEditTask(tasks[index].text);
    // Set the index of the task to be edited
    setEditTaskId(index);

    /* Save updated tasks to localStorage */ 
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }





  // Function to update task:
  const updateTasks = () => {
    // Create a copy of the tasks array
    const newTasks = tasks.slice();
    // Update the task at the index
    newTasks[editTaskId].text = editTask;
    // Update the tasks array
    setTasks(newTasks);
    // Reset the editTaskId
    setEditTaskId(-1);
    setTask("");

    // Save updated tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }





  // Function to get current date to display:
  const getDate = () => {
    const date = new Date();

    // Format how you want the date to be displayed:
    // The long means in their long form, so Monday will be
    // displayed as "Monday" and not "Mon" which is short
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
  }
  


  
  // Toggle between task completed and not:
  // This function will be called when the checkbox is clicked
  const toggleTaskCompletion = (index) => {
    // Create a copy of the task array:
    const newTasks = tasks.slice();
    // Toggle the completed boolean of the selected task
    newTasks[index].completed = !newTasks[index].completed;
    // Update the tasks array:
    setTasks(newTasks);

    // Save updated tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  }




  /* Fetch the quotes from the API */
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((response) => response.json())
      /* Data is what you extract from the "response" object
       * using one of its methods like ".json()" above */
      .then((data) => {
        /* Set the quote state to the quote fetched */
        setQuote(data.slip.advice);
      })

      /* To handle errors: */
      .catch((error) => {
        console.error("There has been an error fetching quote: ", error);
      });

  }, []);
  



  /* Load tasks from localStorage when the component mounts: */
  useEffect(() => {
    const tasks = localStorage.getItem("tasks");
    if (tasks) {
      setTasks(JSON.parse(tasks));
    }
  }, []);








  return (
    /* The wrapper around the whole todo app */
    <div className="flex flex-col items-center">

      {/* Date Header: */}
      <h1 className="relative text-2xl mt-24 md:text-3xl lg:text-4xl mb-8 font-bold text-center montserrat-font">
        {getDate()}
      </h1>
      

      {/* Input and Button */}
      <div className="flex relative border-b-2 border-black justify-center">
        <input type="text"
               placeholder="Add new task"
               className="relative pl-4 py-2 focus:outline-none w-96"
               value={task}
              // Define the onchange event for our input field
              // This will update the task state with the value of the input field
               onChange = {(e) => {
                            setTask(e.target.value);
                          }}
              // Add event handler so that when the "Enter" key
              // is pressed, we add task
              onKeyDown = {(e) => {
                              if(e.key === "Enter") {
                                addTasks();
                              }
                            }}
        />
        
        <button 
              className=" bg-white text-black border-black border-2 px-2 ml-4
                          absolute font-bold text-center bottom-1/2
                          translate-y-1/2 right-0 mr-2 hover:bg-black hover:text-cyan-50"
              
              // When the button is clicked, add the task
              onClick = {addTasks}
        >
          +
        </button>

      </div>


      {/* Header */}
      <h1 className="w-full max-w-96 sm:max-w-[470px] text-xl mt-16 mb-2 font-bold">
        Todo:
      </h1>





      {/* List of tasks */}
      <div className="w-full max-w-96 sm:max-w-[470px] border-black border-2">
        {/* if the tasks array is not empty, display the top paert
        else, display the bottom part */}
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task, index) => (
              // Display the task in a list item
              <div className="flex m-4" key={index}>
              
                {/* If the task is being edited, display the input field
                else display the task */}
                {editTaskId === index ? (
                  <input type="text"
                         className="pl-4 py-2 focus:outline-none w-full border-b-2 border-black mr-6"
                         value={editTask}
                         onChange = {(e) => {
                                      setEditTask(e.target.value);
                                    }}
                         onKeyDown = {(e) => {
                                        if(e.key === "Enter") {
                                          updateTasks();
                                        }
                                      }}
                  />
                ) : (
                  // Display the task with the checkbox:
                  <div className=" flex pr-10 py-3 pl-3 mr-6 font-semibold self-center grow border-b border-black/25">
                    <button
                      className={` mx-1 border-black border-2 ${task.completed ? "bg-black/25" : "bg-white"} hover:bg-black/25`}
                      style={{height: "20px", width: "20px", alignSelf: "center"}}
                      onClick={() => 
                        toggleTaskCompletion(index)
                      }
                    >
                    </button>

                    {/* if task is completed, have a line through the text */}
                    <li className={` ml-2 text-left ${task.completed ? ("line-through text-black/30 font-normal") : ''}`}>
                      {task.text}
                    </li>
                  </div>
                )}




                {/* Edit + Save Button: */}
                {/* Toggle between Save and Edit Button based on
                    the editTaskId. If the editTaskId is = the index of the task
                    display the Save Button, else display the Edit Button */}
                {editTaskId === index ? (
                  <button
                    className="flex items-center justify-center bg-black
                               p-2 mx-1 text-white font-bold border-black border-2
                               w-10 h-10 hover:bg-black/75 hover:border-black hover:border-2}"
                    onClick={updateTasks}
                  >
                    {/* Use save icon */}
                    <BookmarkIcon className="size-4"/>
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center bg-black p-2 mx-1
                               w-10 h-10 text-white font-bold border-black border-2
                               self-center hover:bg-black/75 hover:border-black hover:border-2}"
                    onClick={() => editTasks(index)}
                  >
                    {/* Use edit icon */}
                    <PencilSquareIcon className="size-4"/>
                  </button>
                )}



               {/* Delete Button: */}
                <button 
                  className="flex items-center justify-center bg-[#d3aefe] p-2 mx-1
                           text-black font-bold border-black border-2 self-center
                           w-10 h-10 hover:bg-[#9f6cd9] hover:border-black hover:border-2"
                  // style={{ height: "50px"}}

                  /* Wrap delete task in an anonymous function to prevent
                   * task from automatically deleting */
                  onClick= {() => deleteTasks(index)}
                >
                  {/* Use Trashcan Icon: */}
                  <TrashIcon className="size-4"/>
                </button>
              </div>
            ))}
          </ul>
        ) : (
          // If tasks array is empty, display this
          <p className=" p-3 m-3">
            No tasks found
          </p>
        )}
      </div>


      {/* To Display the Quotes at the bottom: */}
      <div className="w-96 mt-20 mb-16">
        <h1 className="text-left text-sm font-semibold">
          Quote of the Day:
        </h1>
        <p className=" mt-4 text-slate-600 text-sm italic">
          "{quote}"
        </p>
      </div>


    </div>
  )
}

export default App