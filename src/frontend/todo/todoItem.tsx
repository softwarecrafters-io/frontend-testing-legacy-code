import {Todo} from "../../domain/todo";
import * as React from "react";
import {useTodoItem} from "./useTodoItem";

type TodoItemProps = {
    todo: Todo,
    onToggleComplete: (todo: Todo) => void,
    onDelete: (todo:Todo) => void,
    onUpdate: (todo: Todo, newText:string) => void,
}

export function TodoItem(props: TodoItemProps) {
    const {todo, isEditing, newText, handleTextChange, handleEdit, handleUpdate} = useTodoItem(props);
    return <div className="todo-list-item">
        {
            isEditing
                ? <input className="todo-edit-input" defaultValue={todo.text} onChange={handleTextChange}/>
                :
                <p className="todo-text" style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
                    {todo.text}
                    <button className="todo-button edit-todo-button" onClick={handleEdit}>Edit</button>
                </p>
        }
        <button className="todo-button todo-mark-button" onClick={() => props.onToggleComplete(todo)}>
            {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
        <button className="todo-button todo-delete-button" onClick={() => props.onDelete(todo)}>
            Delete Todo
        </button>
        <button className="todo-button todo-update-button" onClick={() => handleUpdate(todo)}>
            Update Todo
        </button>
    </div>;
}
