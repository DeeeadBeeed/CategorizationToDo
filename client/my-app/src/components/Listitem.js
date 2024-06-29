import React, { useState } from "react";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import DeleteModal from "./DeleteModal"; // Import the DeleteModal component

function ListItem({ task, getData }) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        setShowDeleteModal(false); // Close the delete modal after successful deletion
      }
    } catch (error) {
      console.log("Error deleting task:", error);
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
        <button onClick={() => setShowDeleteModal(true)}>Delete</button>
        <button onClick={handleToggleDailyClick}>
          {task.is_daily ? "Unset Daily" : "Set Daily"}
        </button>
      </div>
      {showModal && (
        <Modal mode={'edit'} setShowModal={setShowModal} task={task} getData={getData} />
      )}
      {showDeleteModal && (
        <DeleteModal setShowDeleteModal={setShowDeleteModal} handleDelete={handleDeleteClick} />
      )}
    </div>
  );
}

export default ListItem;
