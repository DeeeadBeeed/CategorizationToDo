import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import ListItem from "./Listitem";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Category({ tasks, getData }) {
    const [cookies] = useCookies(['Email']);
    const [data, setData] = useState({
        user_email: cookies.Email || '',
        category_name: "",
    });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [todos, setTodos] = useState([]);
    const userEmail = cookies.Email;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAllTasks, setShowAllTasks] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (tasks) {
            setTodos(tasks);
        }
    }, [tasks]);

    useEffect(() => {
        if (selectedCategory !== null && tasks) {
            const filteredTasks = tasks.filter(task => task.category_id === selectedCategory);
            setTodos(filteredTasks);
        }
    }, [selectedCategory, tasks]);

    useEffect(() => {
        if (selectedDate !== null && tasks && !showAllTasks) {
            const adjustedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
            const formattedDate = adjustedDate.toISOString().split('T')[0];
            
            const filteredTasks = tasks.filter(task => {
                const taskDate = new Date(task.date).toISOString().split('T')[0];
                return taskDate === formattedDate;
            });
            setTodos(filteredTasks);
        } else if (showAllTasks && tasks) {
            setTodos(tasks);
        }
    }, [selectedDate, tasks, showAllTasks]);

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
    }

    const postCategory = async () => {
        try {
            const response = await fetch(`http://localhost:8000/categories`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.status === 200) {
                console.log('Data updated successfully');
                setData({ ...data, category_name: '' });
                fetchCategories();
            } else {
                console.log('Failed to update data:', response.statusText);
            }
        } catch (err) {
            console.log('Error posting category:', err);
        }
    };

    const handleDeleteClick = async (categoryId) => {
        try { 
            const response = await fetch(`http://localhost:8000/categories/${categoryId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                fetchCategories();
            } else {
                console.log('Failed to delete category:', response.statusText);
            }
        } catch (error) {
            console.log('Error deleting category:', error);
        }
    };

    const handleCategoryClick = async (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
        setShowAllTasks(false); // Reset showAllTasks when date changes
    };

    const handleInputChange = (e) => {
        setData({ ...data, category_name: e.target.value });
    };

    const handleShowAllTasks = () => {
        setShowAllTasks(true);
        getData()
    };
    const filterTasks = (priority) => {
        if (priority === 'All') {
          setTodos(tasks);
        } else {
          const filtered = tasks.filter(task => task.priority.toLowerCase() === priority.toLowerCase());
          setTodos(filtered);
        }
      };
      

    return (
        <div className="all-together">
            <div className="category-container">
                <div className="category-header">Categories</div>
                <input
                    className="category-input"
                    type="text"
                    value={data.category_name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                />
                <button className="category-add-button" onClick={postCategory}>Add</button>
                <div className="category-list-container">
                    <h2 className="category-list-header">Category List</h2>
                    <ul className="category-list">
                        {categories.map((category, index) => (
                            <li className="category-item" key={index}>
                                <button className="category-item-button" onClick={() => handleCategoryClick(category.category_id)}>{category.category_name}</button>
                                <button className="category-delete-button" onClick={() => handleDeleteClick(category.category_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="todos">
                <h2>Tasks</h2>
                <div className="button-container">
                <button className="show-all-tasks-button" onClick={handleShowAllTasks}>Show All Tasks</button>
                
        <button className="high-button" onClick={() => filterTasks('High')}>High Priority</button>
        <button className="mid-button" onClick={() => filterTasks('Mid')}>Mid Priority </button>
        <button className="low-button" onClick={() => filterTasks('Low')}>Low Priority</button>
      </div>
                <ul>
                    {todos.map((todo, index) => (
                        <ListItem getData={getData} key={todo.id} task={todo} />
                    ))}
                </ul>
            </div>
            <div className="calendar">
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                />
            </div>
        </div>
    );
}

export default Category;
