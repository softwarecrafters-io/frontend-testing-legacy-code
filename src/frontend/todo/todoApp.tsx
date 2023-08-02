import * as React from "react";
import {v4 as uuid} from 'uuid';
import {Todo} from "../../domain/todo";
import {TodoItem} from "./todoItem";

type CurrentFilter = 'all' | 'completed' | 'incomplete';

export class TodoApp extends React.Component<any, any> {
    todoList: Todo[] = [];
    todoText: string = '';
    numberOfCompleted: number = 0;
    currentFilter: CurrentFilter = 'all';

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        fetch('http://localhost:3000/api/todos/')
            .then(response => response.json())
            .then(data => {
                this.todoList = data;
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    addTodo() {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const forbidden = ['prohibited', 'forbidden', 'banned'];

        // Validación de longitud mínima y máxima
        if (this.todoText.length < min || this.todoText.length > max) {
            alert(`Error: The todo text must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.todoText)) {
            // Validación de caracteres especiales
            alert('Error: The todo text can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            const words = this.todoText.split(/\s+/);
            let foundForbiddenWord = false;
            for (let word of words) {
                if (forbidden.includes(word)) {
                    alert(`Error: The todo text cannot include the prohibited word "${word}"`);
                    foundForbiddenWord = true;
                    break;
                }
            }

            if (!foundForbiddenWord) {
                // Validación de texto repetido
                let isRepeated = false;
                for (let i = 0; i < this.todoList.length; i++) {
                    if (this.todoList[i].text === this.todoText) {
                        isRepeated = true;
                        break;
                    }
                }

                if (isRepeated) {
                    alert('Error: The todo text is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, agregar el "todo"
                    fetch('http://localhost:3000/api/todos/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({id: uuid(), text: this.todoText, completed: false}),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.todoList.push(data);
                            this.todoText = '';
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    updateTodo = (index: number, todo: Todo) => {
        const minLength = 3;
        const maxLength = 100;
        const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
        const hasValidLength = todo.text.length < minLength || todo.text.length > maxLength;
        if (hasValidLength) {
            alert(`Error: The todo text must be between ${minLength} and ${maxLength} characters long.`);
            return;
        }
        const isValidText = /[^a-zA-Z0-9\s]/.test(todo.text);
        if (isValidText) {
            alert('Error: The todo text can only contain letters, numbers, and spaces.');
            return;
        }
        const words = todo.text.split(/\s+/);
        const hasForbiddenWords = words.filter(word => forbiddenWords.includes(word)).length > 0;
        if (hasForbiddenWords) {
            alert(`Error: The todo text cannot include a prohibited word"`);
            return;
        }
        this.todoList.forEach((todo, i) => {
            if (i !== index && todo.text === todo.text) {
                alert('Error: The todo text is already in the collection.');
                return;
            }
        });
        fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: todo.text, completed: this.todoList[index].completed}),
        })
            .then(response => response.json())
            .then(data => {
                this.todoList[index] = data;
                this.forceUpdate();
            });
    };

    deleteTodo = index => {
        fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {method: 'DELETE'})
            .then(() => {
                if (this.todoList[index].completed) {
                    this.numberOfCompleted--;
                }
                this.todoList.splice(index, 1);
                this.forceUpdate();
            })
    };

    toggleComplete = index => {
        this.todoList[index].completed = !this.todoList[index].completed;
        fetch(`http://localhost:3000/api/todos/${this.todoList[index].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({completed: this.todoList[index].completed}),
        })
            .then(response => response.json())
            .then(data => {
                // this.collection[index] = data;
                this.todoList[index].completed ? this.numberOfCompleted++ : this.numberOfCompleted--;
                this.forceUpdate();
            })
    };

    toggleAllComplete() {
        let areAllComplete = true;
        for (const i = 0; i < this.todoList.length; i++) {
            if (!this.todoList[i].completed) {
                areAllComplete = false;
                break;
            }
        }
        for (const i = 0; i < this.todoList.length; i++) {
            this.todoList[i].completed = !areAllComplete;
            fetch(`http://localhost:3000/api/todos/${this.todoList[i].id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({completed: this.todoList[i].completed}),
            })
                .then(response => response.json())
                .then(data => {
                    this.todoList[i] = data;
                    this.forceUpdate();
                })
        }
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
                <button className="todo-button add-todo-button" onClick={this.addTodo.bind(this)}>
                    Add Todo
                </button>
                <button className="todo-button" onClick={this.toggleAllComplete.bind(this)}>
                    Mark All Complete
                </button>
                <h2>Completed Todos: {this.numberOfCompleted}</h2>
                <div>
                    <button className="todo-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
                    <button className="todo-button completed-filter"
                            onClick={this.setFilter.bind(this, 'completed')}>Completed
                    </button>
                    <button className="todo-button incomplete-filter"
                            onClick={this.setFilter.bind(this, 'incomplete')}>Incomplete
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
