import * as React from "react";
import {TodoItem} from "./todoItem";
import {TodoApiRepository} from "../../infrastructure/repositories/todoApiRepository";
import {useTodoApp} from "./useTodoApp";

export function TodoApp(){
    const {
        todoText,
        numberOfCompleted,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        handleFilter,
        handleTodoTextChange,
        filteredTodoList,
    } = useTodoApp(new TodoApiRepository('http://localhost:3000/api/todos/'));

    return (
        <div className="todo-app-container">
            <h1>TODOLIST APP</h1>
            <input className="todo-input" defaultValue={todoText} onChange={handleTodoTextChange}/>
            <button className="todo-button add-todo-button" onClick={()=> addTodo()}>
                Add Todo
            </button>
            <h2>Completed Todos: {numberOfCompleted}</h2>
            <div>
                <button className="todo-button all-filter" onClick={()=> handleFilter('all')}>All</button>
                <button className="todo-button completed-filter" onClick={()=>handleFilter('completed')}>Completed</button>
                <button className="todo-button incomplete-filter" onClick={()=>handleFilter('incomplete')}>Incomplete</button>
            </div>
            {filteredTodoList().map((todo) =>
                <TodoItem key={todo.id} todo={todo} onToggleComplete={toggleComplete} onDelete={deleteTodo} onUpdate={updateTodo}/>
            )}
        </div>
    );
}
