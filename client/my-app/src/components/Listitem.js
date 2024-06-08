import React, { useState } from "react";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";

function ListItem({ task, getData }) {
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: "DELETE"
      });
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.log("err");
    }
  };

  const handleToggleDailyClick = async () => {
    try {
      const newIsDailyStatus = !task.is_daily;
      const response = await fetch(`http://localhost:8000/todos/setDaily/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDaily: newIsDailyStatus }),
      });
      if (response.status === 200) {
        getData();
      }
    } catch (error) {
      console.log("Error toggling daily status:", error);
    }
  };

  return (
    <div className={`ListItem ${task.is_daily ? 'daily' : ''}`}>
      <p>{task.title}</p>
      <ProgressBar progress={task.progress} />
      <div>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={handleDeleteClick}>Delete</button>
        <button onClick={handleToggleDailyClick}>
          {task.is_daily ? "Unset Daily" : "Set Daily"}
        </button>
      </div>
      {showModal && (
        <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />
      )}
    </div>
  );
}

export default ListItem;
