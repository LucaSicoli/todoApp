import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTodo = () => {
    axios.post('http://localhost:5000/todos', { text: newTodo })
      .then(response => setTodos([...todos, response.data]))
      .catch(error => console.error(error));
    setNewTodo("");
  };

  const editTodo = (id) => {
    setEditingId(id);
    const todo = todos.find(todo => todo._id === id);
    setEditingText(todo.text);
  };

  const saveTodo = (id) => {
    axios.put(`http://localhost:5000/todos/${id}`, { text: editingText })
      .then(response => {
        const updatedTodos = todos.map(todo => todo._id === id ? response.data : todo);
        setTodos(updatedTodos);
      })
      .catch(error => console.error(error));
    setEditingId(null);
    setEditingText("");
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error(error));
  };

  const toggleComplete = (id) => {
    axios.put(`http://localhost:5000/todos/complete/${id}`)
      .then(response => {
        const updatedTodos = todos.map(todo => todo._id === id ? response.data : todo);
        setTodos(updatedTodos);
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-purple-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Todo List</h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New Todo"
            className="flex-1 px-3 py-2 rounded-l-lg border-none focus:outline-none"
          />
          <button
            onClick={addTodo}
            className="bg-white text-green-500 px-4 py-2 rounded-r-lg font-semibold hover:bg-gray-200"
          >
            Add Todo
          </button>
        </div>

        <ul className="space-y-4">
          {todos.map(todo => (
            <li key={todo._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  className={`flex-1 cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                  onClick={() => toggleComplete(todo._id)}
                >
                  {todo.text}
                </span>
              )}

              {editingId === todo._id ? (
                <button
                  onClick={() => saveTodo(todo._id)}
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => editTodo(todo._id)}
                    className="ml-4 text-blue-500 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
