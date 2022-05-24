import { useState } from "react";

const useHTTP = (post = null, onConcat = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let createdTask = {};
  let loadedTasks = [];

  const taskHandler = async (taskText) => {
    console.log("TaskHandler RUNNING")
    setIsLoading(true);
    setError(null);

    let content = {};
    if (post) {
      content = {
        method: "POST",
        body: JSON.stringify({ text: taskText }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    try {
      const response = await fetch(
        "https://react-http-d578e-default-rtdb.firebaseio.com/tasks.json",
        content
      );

      if (!response.ok) {
        throw new Error("Request failed!");
      } else {
      }

      const data = await response.json();

      if (post) {
        const generatedId = data.name; // firebase-specific => "name" contains generated id
        createdTask = { id: generatedId, text: taskText };
        onConcat(createdTask);
      } else {
        loadedTasks = [];

        for (const taskKey in data) {
          loadedTasks.push({ id: taskKey, text: data[taskKey].text });
        }
        onConcat(loadedTasks)
      }
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  };

  return {
    isLoading: isLoading,
    hasError: error,
    onTaskRequest: taskHandler,
    newTask: createdTask,
    tasksList: loadedTasks,
  };
};

export default useHTTP;
