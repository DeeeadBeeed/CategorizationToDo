import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Modal({ mode, setShowModal, task, getData }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;
  const [categories, setCategories] = useState(['Personal']);
  const userEmail = cookies.Email;

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : "", 
    progress: editMode ? task.progress : 0,
    date: editMode ? new Date(task.date) : new Date(),
    category_id: editMode ? task.category_id : "",
    priority:editMode ? task.priority:""
  });   

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    console.log("Selected Date:", date.toLocaleDateString()); 
    setData(prevData => ({
        ...prevData,
        date: date
    }));
};


  const postData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log('Data updated successfully');
        setShowModal(false); 
      } else {
        console.log('Failed to update data:', response.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/todos/${task.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        console.log('Data updated successfully');
        setShowModal(false); 
        getData();
      } else {
        console.log('Failed to update data:', response.statusText);
      }
    } catch (err) {
      console.log('Error updating data:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8000/categories/${userEmail}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } else {
        console.log('Failed to fetch categories:', response.statusText);
      }
    } catch (err) {
      console.log('Error fetching categories:', err);
    }
  };


  return (
    <div className="overlay">
      <div className="modal">
        <div>
          <h3>Let's {mode} the tasks</h3>
          <button className="close-button" onClick={() => setShowModal(false)}>X</button>
        </div>
        <form>
          <input
            required
            maxLength={30}
            placeholder="Input Your text"
            value={data.title}
            onChange={handleChange}
            name="title"
          />
          <input
            required
            type="range"
            min={0}
            max={100}
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <select name="category_id" value={data.category_id} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
            ))}
          </select>
          <div className="date-picker-container">
      <label htmlFor="due-date-picker" className="date-picker-label">Due Date : </label>
      <DatePicker
        id="due-date-picker"
        selected={data.date}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        className="date-picker-input"
      />
      <div>
            <label htmlFor="priority">Priority: </label>
            <select name="priority" value={data.priority} onChange={handleChange}>
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="mid">Mid</option>
              <option value="low">Low</option>
            </select>
          </div>
    </div>
          <input className={mode} type="submit" onClick={editMode ? editData : postData}/>
        </form>
      </div>
    </div>
  );
}

export default Modal;
