import ListHeader from "./components/ListHeader.js";
import { useEffect, useState } from "react";
import ListItem from "./components/Listitem";
import Auth from "./components/Auth.js";
import { useCookies } from "react-cookie";
import Category from "./components/Category.js";
import './index.css'
import Navbar from "./components/Navbar.js";

function App() {
  const [cookies] = useCookies(["AuthToken", "Email"]);
  const [tasks, setTasks] = useState(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`);
      const json = await response.json(); 
      setTasks(json); // Update tasks state with fetched data
    } catch (err) {
      console.log(err);
    }
  };
    
  useEffect(() => {
    if(authToken) {
      getData(); // Call getData function when component mounts
    }
  }, [authToken]); // Call getData when authToken changes



  return (
    <div className="App">
      {authToken ? (
        <div>
          <Navbar/>
        <ListHeader tasks={tasks} getData={getData} />
        <Category tasks={tasks} getData={getData} />
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
