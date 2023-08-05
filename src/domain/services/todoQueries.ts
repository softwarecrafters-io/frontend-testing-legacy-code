import {Todo} from "../todo";

export type CurrentFilter = 'all' | 'completed' | 'incomplete';

export const filterTodo = (todoList: Todo[], currentFilter: CurrentFilter) => {
    const filteredTodos: Todo[] = [];
    for (let i = 0; i < todoList.length; i++) {
        if (
            currentFilter === 'all' ||
            (currentFilter === 'completed' && todoList[i].completed) ||
            (currentFilter === 'incomplete' && !todoList[i].completed)
        ) {
            filteredTodos.push(todoList[i]);
        }
    }
    return filteredTodos;
};

export const ensureIsNotRepeated = (todoList: Todo[], todoText: string) => {
    if(todoList.find(todo => todo.text === todoText)) {
        throw new Error('The todo text is already in the collection.');
    }
}
