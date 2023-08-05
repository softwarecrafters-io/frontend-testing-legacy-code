import {Todo, updateTodo} from "../../domain/todo";
import * as React from "react";
import {useState} from "react";

type TodoItemProps = {
    index: number,
    todo: Todo,
    onToggleComplete: (index: number) => void,
    onDelete: (index: number) => void,
    onUpdate: (todo: Todo, newText:string) => void,
}

type TodoItemState = {
    newText: string,
    isEditing: boolean,
}

export function TodoItem({index, todo, onToggleComplete, onDelete, onUpdate}: TodoItemProps) {
    const [state, setState] = useState<TodoItemState>({newText: '', isEditing: false});
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, newText: event.target.value});
    }
    const handleEdit = () => {
        setState({...state, isEditing: true});
    }
    const handleUpdate = (index: number, todo: Todo) => {
        setState({...state, isEditing: false});
        onUpdate(todo, state.newText)
    }
    return <div className="todo-list-item">
        {
            state.isEditing
                ? <input className="todo-edit-input" defaultValue={todo.text} onChange={handleTextChange}/>
                :
                <p className="todo-text" style={{textDecoration: todo.completed ? 'line-through' : 'none'}}>
                    {todo.text}
                    <button className="todo-button edit-todo-button" onClick={handleEdit}>Edit</button>
                </p>
        }
        <button className="todo-button todo-mark-button" onClick={() => onToggleComplete(index)}>
            {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
        </button>
        <button className="todo-button todo-delete-button" onClick={() => onDelete(index)}>
            Delete Todo
        </button>
        <button className="todo-button todo-update-button" onClick={() => handleUpdate(index, todo)}>
            Update Todo
        </button>
    </div>;
}
