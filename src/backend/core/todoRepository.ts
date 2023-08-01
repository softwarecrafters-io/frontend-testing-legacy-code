import { Todo } from './todo';

export class TodoRepositoryInMemory {
    constructor(private todos: Todo[] = []) {}

    getAll(): Todo[] {
        return this.todos;
    }

    add(todo: Todo): void {
        this.todos.push(todo);
    }

    delete(id: string): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    update(id: string, data: Partial<Todo>): void {
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            throw new Error('Todo not found');
        }
        this.todos[todoIndex] = { ...this.todos[todoIndex], ...data };
    }
}
