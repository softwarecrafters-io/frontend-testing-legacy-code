import {Todo} from "../../domain/todo";

export class TodoApiRepository {
    constructor(private baseUrl: string) {
    }

    getAll(): Promise<Todo[]> {
        return fetch(this.baseUrl)
            .then(response => response.json());
    }

    add(todo: Todo): Promise<Todo> {
        return fetch(this.baseUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(todo),
        })
            .then(response => response.json());
    }

    update(todo: Todo): Promise<Todo> {
        return fetch(this.baseUrl + todo.id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: todo.text, completed: todo.completed}),
        })
            .then(response => response.json());
    }

    delete(todo: Todo): Promise<{ }> {
        return fetch(this.baseUrl + todo.id, {
            method: 'DELETE'
        })
    }
}
