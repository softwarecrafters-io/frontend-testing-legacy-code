import {Todo} from "../../domain/todo";
import * as React from "react";
import {useState} from "react";

type TodoItemState = {
    newText: string,
    isEditing: boolean,
}

export const useTodoItem = ({todo, onUpdate}: { todo: Todo, onUpdate: (todo: Todo, newText: string) => void }) => {
    const [state, setState] = useState<TodoItemState>({newText: '', isEditing: false});
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({...state, newText: event.target.value});
    }
    const handleEdit = () => {
        setState({...state, isEditing: true});
    }
    const handleUpdate = (todo: Todo) => {
        setState({...state, isEditing: false});
        onUpdate(todo, state.newText)
    }
    return {todo, isEditing: state.isEditing, newText: state.newText, handleTextChange, handleEdit, handleUpdate};
}
