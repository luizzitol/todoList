import React, { useState } from "react";

function Input({ addToDo }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addToDo(input);
          setInput("");
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="Submit" className="button">
          <span>Add</span>
        </button>
      </form>
    </div>
  );
}

export default Input;
