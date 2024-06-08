import React, { useState } from "react";
import Modal from "./Modal"; 
import { useCookies } from 'react-cookie';

function ListHeader({ getData, tasks }) {
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="App">
      <div className="Middle">
        <h1>To Do List</h1>
        <div className="button-container">
          <button className="create" onClick={() => setShowModal(true)}>Add New</button>
        </div>
        {showModal && <Modal mode={"create"} setShowModal={setShowModal} getData={getData} />}
      </div>
    </div>
  );
}

export default ListHeader;
