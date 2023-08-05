import {v4 as uuid} from "uuid";

export type Todo = {
    readonly id: string,
    readonly text: string,
    completed: boolean
}

export function toggleTodoCompleted(todo: Todo) {
    return {
        ...todo,
        completed: !todo.completed
    }
}

export function updateTodo(todo: Todo, text: string) {
    ensureThatHaveValidLength(text);
    ensureThatOnlyContainsAlphanumeric(text);
    ensureThatNotContainsProhibitedWords(text);
    return {
        ...todo,
        text: text
    }
}

export function createTodo(text: string): Todo {
    ensureThatHaveValidLength(text);
    ensureThatOnlyContainsAlphanumeric(text);
    ensureThatNotContainsProhibitedWords(text);
    return {
        id: uuid(),
        text: text,
        completed: false
    }
}

function ensureThatHaveValidLength(text: string) {
    const minLength = 3;
    const maxLength = 100;
    if (!text || text.length < minLength || text.length > maxLength) {
        throw new Error(`Error: The todo text must be between ${minLength} and ${maxLength} characters long.`);
    }
}

function ensureThatOnlyContainsAlphanumeric(text: string) {
    if (!/^[a-zA-Z0-9 ]+$/.test(text)) {
        throw new Error('Error: The todo text can only contain letters, numbers, and spaces.');
    }
}

function ensureThatNotContainsProhibitedWords(text: string) {
    const prohibitedWords = ['prohibited', 'forbidden', 'banned'];
    if (prohibitedWords.some(word => text.includes(word))) {
        throw new Error(`Error: The todo text cannot include a prohibited word.`);
    }
}
