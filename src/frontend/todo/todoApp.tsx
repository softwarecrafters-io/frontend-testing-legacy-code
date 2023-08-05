import * as React from "react";
import {createTodo, Todo, toggleTodoCompleted, updateTodo} from "../../domain/todo";
import {TodoItem} from "./todoItem";
import {TodoApiRepository} from "../../infrastructure/repositories/todoApiRepository";
import {CurrentFilter, ensureIsNotRepeated, filterTodo} from "../../domain/services/todoQueries";

export class TodoApp extends React.Component<any, any> {
    todoList: Todo[] = [];
    todoText: string = '';
    numberOfCompleted: number = 0;
    currentFilter: CurrentFilter = 'all';
    todoRepository = new TodoApiRepository('http://localhost:3000/api/todos/');

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        this.todoRepository.getAll()
            .then(this.handleGetAllSuccess)
    }

    handleGetAllSuccess = (todoList: Todo[]) => {
        this.todoList = todoList;
        this.forceUpdate();
    }

    addTodo(todoText:string) {
        try{
            const newTodo = createTodo(todoText);
            ensureIsNotRepeated( this.todoList, todoText)
            this.todoRepository.add(newTodo)
                .then(this.handleAddSuccess);
        }
        catch(e){
            alert(e.message);
        }
    }

    handleAddSuccess = (todo:Todo) => {
        this.todoList.push(todo);
        this.todoText = '';
        this.forceUpdate();
    }

    updateTodo = (todo:Todo, newText: string) => {
        try{
            const updatedTodo = updateTodo(todo, newText);
            ensureIsNotRepeated( this.todoList, newText)
            this.todoRepository.update(updatedTodo)
                .then(_ => {
                    this.handleUpdateSuccess(updatedTodo);
                });
        }
        catch(e){
            alert(e.message)
        }
    };

    handleUpdateSuccess = (todo:Todo) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        this.todoList[index] = todo;
        this.forceUpdate();
    }

    deleteTodo = (todo:Todo) => {
        this.todoRepository.delete(todo)
            .then(() => this.handleDeleteSuccess(todo));
    };

    handleDeleteSuccess = (todo:Todo) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        if (this.todoList[index].completed) {
            this.numberOfCompleted--;
        }
        this.todoList.splice(index, 1);
        this.forceUpdate();
    }

    toggleComplete = (todo:Todo) => {
        const completedTodo = toggleTodoCompleted(todo);
        this.todoRepository.update(completedTodo)
            .then(_ => this.handleToggleCompleteSuccess(completedTodo))
    };

    handleToggleCompleteSuccess = (todo:Todo) => {
        const index = this.todoList.findIndex(item => item.id === todo.id);
        this.todoList[index] = todo;
        todo.completed ? this.numberOfCompleted++ : this.numberOfCompleted--;
        this.forceUpdate();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.forceUpdate();
    }

    handleNewTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.todoText = event.target.value;
        this.forceUpdate();
    };

    render() {
        const todosToShow = filterTodo(this.todoList, this.currentFilter);
        return (
            <div className="todo-app-container">
                <h1>TODOLIST APP</h1>
                <input
                    className="todo-input"
                    value={this.todoText}
                    onChange={this.handleNewTextChange}
                />
                <button className="todo-button add-todo-button" onClick={()=> this.addTodo(this.todoText)}>
                    Add Todo
                </button>
                <h2>Completed Todos: {this.numberOfCompleted}</h2>
                <div>
                    <button className="todo-button all-filter" onClick={()=> this.setFilter('all')}>All</button>
                    <button className="todo-button completed-filter"
                            onClick={()=>this.setFilter('completed')}>Completed
                    </button>
                    <button className="todo-button incomplete-filter"
                            onClick={()=>this.setFilter('incomplete')}>Incomplete
                    </button>
                </div>
                {todosToShow.map((todo, index) =>
                    <TodoItem index={index} todo={todo} onToggleComplete={this.toggleComplete}
                              onDelete={this.deleteTodo} onUpdate={this.updateTodo}/>
                )}
            </div>
        );
    }
}
