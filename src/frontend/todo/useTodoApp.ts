import {TodoApiRepository} from "../../infrastructure/repositories/todoApiRepository";
import {CurrentFilter, ensureIsNotRepeated, filterTodo} from "../../domain/services/todoQueries";
import * as React from "react";
import {useEffect} from "react";
import {createTodo, Todo, toggleTodoCompleted, updateTodoText} from "../../domain/todo";

type TodoAppState = {
    todoList: Todo[],
    todoText: string,
    numberOfCompleted: number,
    currentFilter: CurrentFilter
}

export const useTodoApp = (todoRepository: TodoApiRepository) => {
    const initialState = {
        todoList: [],
        todoText: '',
        numberOfCompleted: 0,
        currentFilter: 'all' as CurrentFilter
    };
    const [state, setState] = React.useState<TodoAppState>(initialState);

    useEffect(() => {
        todoRepository.getAll().then(todoList => setState({...state, todoList}))
    }, []);

    const addTodo = () => {
        try {
            const newTodo = createTodo(state.todoText);
            ensureIsNotRepeated(state.todoList, state.todoText)
            todoRepository.add(newTodo).then(handleAddSuccess);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleAddSuccess = (todo: Todo) =>
        setState({...state, todoList: [...state.todoList, todo], todoText: ''});

    const updateTodo = (todo: Todo, newText: string) => {
        try {
            const updatedTodo = updateTodoText(todo, newText);
            ensureIsNotRepeated(state.todoList, newText)
            todoRepository.update(updatedTodo).then(_ => handleUpdateSuccess(updatedTodo));
        } catch (e) {
            alert(e.message)
        }
    };

    const handleUpdateSuccess = (todo: Todo) => {
        const updatedTodoList = state.todoList.map(t => t.id === todo.id ? todo : t)
        setState({...state, todoList: [...updatedTodoList]})
    };

    const deleteTodo = (todo: Todo) =>
        todoRepository.delete(todo).then(() => handleDeleteSuccess(todo));

    const handleDeleteSuccess = (todo: Todo) => {
        const todoList = state.todoList.filter(t => t.id !== todo.id)
        setState({...state, todoList: [...todoList]})
    };

    const toggleComplete = (todo: Todo) => {
        const completedTodo = toggleTodoCompleted(todo);
        todoRepository.update(completedTodo).then(_ => handleToggleCompleteSuccess(completedTodo))
    };

    const handleToggleCompleteSuccess = (todo: Todo) => {
        const index = state.todoList.findIndex(item => item.id === todo.id);
        state.todoList[index] = todo;
        setState({...state, todoList: [...state.todoList]})
    };

    const handleFilter = (filter: CurrentFilter) =>
        setState({...state, currentFilter: filter})

    const handleTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setState({...state, todoText: event.target.value});

    const filteredTodoList = () =>
        filterTodo(state.todoList, state.currentFilter);

    return {
        todoText:state.todoText,
        numberOfCompleted:state.numberOfCompleted,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        handleFilter,
        handleTodoTextChange,
        filteredTodoList
    }
}
