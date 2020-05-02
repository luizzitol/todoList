import React from "react";

function ToDo({ text, id, deleteToDo }) {
  return <li onClick={() => deleteToDo(id)}>{text}</li>;
}

export default ToDo;
