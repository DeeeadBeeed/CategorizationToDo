import React from "react";

function DeleteModal({ setShowDeleteModal, handleDelete }) {
  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <h2>Are you sure you want to delete this task?</h2>
        <button onClick={handleDelete}>Yes</button>
        <button onClick={() => setShowDeleteModal(false)}>No</button>
      </div>
    </div>
  );
}

export default DeleteModal;
