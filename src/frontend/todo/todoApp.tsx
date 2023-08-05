import * as React from "react";
import {createTodo, Todo} from "../../domain/todo";
import {TodoItem} from "./todoItem";
import {TodoApiRepository} from "../../infrastructure/repositories/todoApiRepository";

type CurrentFilter = 'all' | 'completed' | 'incomplete';

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
            .then(data => {
                this.todoList = data;
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    onAddTodo(todoText:string) {
        try{
            const newTodo = createTodo(todoText);
            this.addTodo(newTodo);
        }
        catch(e){
            alert(e.message);
        }
    }

    private addTodo(todo: Todo) {
        const isRepeated = this.todoList.some((item) => item.text === todo.text);
        if (isRepeated) {
            alert('Error: The todo text is already in the collection.');
            return;
        }
        this.todoRepository.add(todo)
            .then(data => {
                this.todoList.push(data);
                this.todoText = '';
                this.forceUpdate();
            });
    }

    updateTodo = (index: number, todo: Todo) => {
        const isRepeated = this.todoList.some((item) => item.text === todo.text);
        if (isRepeated) {
            alert('Error: The todo text is already in the collection.');
            return;
        }
        this.todoRepository.update(todo)
            .then(data => {
                this.todoList[index] = data;
                this.forceUpdate();
            });
    };

    deleteTodo = index => {
        const todo = this.todoList[index];
        this.todoRepository.delete(todo)
            .then(() => {
                if (this.todoList[index].completed) {
                    this.numberOfCompleted--;
                }
                this.todoList.splice(index, 1);
                this.forceUpdate();
            })
    };

    toggleComplete = index => {
        const todo = this.todoList[index];
        todo.completed = !todo.completed;
        this.todoRepository.update(todo)
            .then(data => {
                todo.completed ? this.numberOfCompleted++ : this.numberOfCompleted--;
                this.forceUpdate();
            })
    };

    toggleAllComplete() {
        let areAllComplete = true;
        for (const item of this.todoList) {
            if (!item.completed) {
                areAllComplete = false;
                break;
            }
        }
        this.todoList.forEach(item => {
            item.completed = !areAllComplete;
            this.todoRepository.update(item)
                .then(data => {
                    item = data;
                    this.forceUpdate();
                })
        });
        this.numberOfCompleted = areAllComplete ? 0 : this.todoList.length;
        this.forceUpdate();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.forceUpdate();
    }

    getFilteredTodos() {
        const filteredTodos: Todo[] = [];
        for (let i = 0; i < this.todoList.length; i++) {
            if (
                this.currentFilter === 'all' ||
                (this.currentFilter === 'completed' && this.todoList[i].completed) ||
                (this.currentFilter === 'incomplete' && !this.todoList[i].completed)
            ) {
                filteredTodos.push(this.todoList[i]);
            }
        }
        return filteredTodos;
    }

    handleNewTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.todoText = event.target.value;
        this.forceUpdate();
    };

    render() {
        const todosToShow = this.getFilteredTodos();

        return (
            <div className="todo-app-container">
                <h1>TODOLIST APP</h1>
                <input
                    className="todo-input"
                    value={this.todoText}
                    onChange={this.handleNewTextChange}
                />
                <button className="todo-button add-todo-button" onClick={()=> this.onAddTodo(this.todoText)}>
                    Add Todo
                </button>
                <button className="todo-button" onClick={()=>this.toggleAllComplete()}>
                    Mark All Complete
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
