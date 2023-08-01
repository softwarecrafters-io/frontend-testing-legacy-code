import * as React from "react";
import {v4 as uuid} from 'uuid';

export class TodoApp extends React.Component<any, any> {
    collection = [];
    inputData = '';
    inputUpdateData = '';
    counter = 0;
    f = 'all';
    updating = [];

    constructor(props) {
        super(props);
        fetch('http://localhost:3000/api/todos/')
            .then(response => response.json())
            .then(data => {
                this.collection = data;
                for (let i = 0; i < this.collection.length; i++) {
                    this.updating.push(false);
                }
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    handleInputChange(event) {
        var value = event.target.value;
        this.inputData = value;
        this.forceUpdate();
    }

    addTodo() {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const forbidden = ['prohibited', 'forbidden', 'banned'];

        // Validación de longitud mínima y máxima
        if (this.inputData.length < min || this.inputData.length > max) {
            alert(`Error: The todo text must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.inputData)) {
            // Validación de caracteres especiales
            alert('Error: The todo text can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            const words = this.inputData.split(/\s+/);
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
                for (let i = 0; i < this.collection.length; i++) {
                    if (this.collection[i].text === this.inputData) {
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
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({id:uuid(), text: this.inputData, completed: false }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.collection.push(data);
                            this.inputData = '';
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    updateTodo(index) {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const words = ['prohibited', 'forbidden', 'banned'];

        // Validación de longitud mínima y máxima
        if (this.inputUpdateData.length < min || this.inputUpdateData.length > max) {
            alert(`Error: The todo text must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.inputUpdateData)) {
            // Validación de caracteres especiales
            alert('Error: The todo text can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            let temp1 = false;
            for (let word of this.inputUpdateData.split(/\s+/)) {
                if (words.includes(word)) {
                    alert(`Error: The todo text cannot include the prohibited word "${word}"`);
                    temp1 = true;
                    break;
                }
            }

            if (!temp1) {
                // Validación de texto repetido (excluyendo el índice actual)
                let temp2 = false;
                for (let i = 0; i < this.collection.length; i++) {
                    if (i !== index && this.collection[i].text === this.inputUpdateData) {
                        temp2 = true;
                        break;
                    }
                }

                if (temp2) {
                    alert('Error: The todo text is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, actualizar el "todo"
                    fetch(`http://localhost:3000/api/todos/${this.collection[index].id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: this.inputUpdateData, completed: this.collection[index].completed }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.collection[index] = data;
                            this.close(index);
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    handleUpdateInputChange(event) {
        var value = event.target.value;
        this.inputUpdateData = value;
        this.forceUpdate();
    }

    deleteTodo(index) {
        fetch(`http://localhost:3000/api/todos/${this.collection[index].id}`, { method: 'DELETE' })
            .then(() => {
                if (this.collection[index].completed) {
                    this.counter--;
                }
                this.collection.splice(index, 1);
                this.forceUpdate();
            })
    }

    toggleComplete(index) {
        this.collection[index].completed = !this.collection[index].completed;
        fetch(`http://localhost:3000/api/todos/${this.collection[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: this.collection[index].completed }),
        })
            .then(response => response.json())
            .then(data => {
                // this.collection[index] = data;
                this.collection[index].completed ? this.counter++ : this.counter--;
                this.forceUpdate();
            })
    }

    toggleAllComplete() {
        var areAllComplete = true;
        for (var i = 0; i < this.collection.length; i++) {
            if (!this.collection[i].completed) {
                areAllComplete = false;
                break;
            }
        }
        for (var i = 0; i < this.collection.length; i++) {
            this.collection[i].completed = !areAllComplete;
            fetch(`http://localhost:3000/api/todos/${this.collection[i].id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: this.collection[i].completed }),
            })
                .then(response => response.json())
                .then(data => {
                    this.collection[i] = data;
                    this.forceUpdate();
                })
        }
        this.counter = areAllComplete ? 0 : this.collection.length;
        this.forceUpdate();
    }

    setFilter(filter) {
        this.f = filter;
        this.forceUpdate();
    }

    getFilteredTodos() {
        var filteredTodos = [];
        for (var i = 0; i < this.collection.length; i++) {
            if (
                this.f === 'all' ||
                (this.f === 'completed' && this.collection[i].completed) ||
                (this.f === 'incomplete' && !this.collection[i].completed)
            ) {
                filteredTodos.push(this.collection[i]);
            }
        }
        return filteredTodos;
    }

    edit(index, text){
        this.inputUpdateData = text;
        this.updating[index] = true;
        this.forceUpdate();
    }

    close(index){
        this.updating[index] = false;
        this.forceUpdate();
    }

    render() {
        const todosToShow = this.getFilteredTodos();

        return (
            <div className="todo-app-container">
                <h1>TODOLIST APP</h1>
                <input
                    className="todo-input"
                    value={this.inputData}
                    onChange={this.handleInputChange.bind(this)}
                />
                <button className="todo-button add-todo-button" onClick={this.addTodo.bind(this)}>
                    Add Todo
                </button>
                <button className="todo-button" onClick={this.toggleAllComplete.bind(this)}>
                    Mark All Complete
                </button>
                <h2>Completed Todos: {this.counter}</h2>
                <div>
                    <button className="todo-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
                    <button className="todo-button completed-filter" onClick={this.setFilter.bind(this, 'completed')}>Completed</button>
                    <button className="todo-button incomplete-filter" onClick={this.setFilter.bind(this, 'incomplete')}>Incomplete</button>
                </div>
                {todosToShow.map((todo, index) => (
                    <div className="todo-list-item">
                        {
                            this.updating[index]
                                ? <input
                                    className="todo-edit-input"
                                    defaultValue={todo.text} // Asumiendo que inputData se usa para la edición
                                    onChange={this.handleUpdateInputChange.bind(this)}
                                />
                                :  <p className="todo-text" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text} <button className="todo-button edit-todo-button" onClick={()=> this.edit(index, todo.text)}>Edit</button></p>

                        }
                        <button className="todo-button todo-mark-button" onClick={this.toggleComplete.bind(this, index)}>
                            {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </button>
                        <button className="todo-button todo-delete-button" onClick={this.deleteTodo.bind(this, index)}>
                            Delete Todo
                        </button>

                        <button className="todo-button todo-update-button" onClick={this.updateTodo.bind(this, index)}>
                            Update Todo
                        </button>
                    </div>
                ))}
            </div>
        );
    }
}
