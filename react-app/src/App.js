import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Input from "./Input";
import ToDo from "./ToDo";

function App() {
  const [todos, setTodos] = useState([]);
  const route = useLocation().pathname.slice(1);
  const location = "/api" + useLocation().pathname;
  console.log(location);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  function fetchData() {
    fetch(location)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }

  function addToDo(text) {
    fetch(location, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then(() => fetchData())
      .catch(console.log);
  }

  function deleteToDo(id) {
    fetch(location, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then(() => fetchData())
      .catch(console.log);
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>{route}</h1>
      </div>
      <Input addToDo={addToDo} />
      <ul>
        {todos.map((todo) => (
          <ToDo
            id={todo._id}
            key={todo._id}
            deleteToDo={deleteToDo}
            text={todo.text}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
