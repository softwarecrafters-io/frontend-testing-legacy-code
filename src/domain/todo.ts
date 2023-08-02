export type Todo = {
    id: string,
    text: string,
    completed: boolean
}

export function updateTodo(todo: Todo, text: string) {
    return {
        ...todo,
        text: text
    }
}
