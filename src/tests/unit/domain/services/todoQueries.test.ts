import {Todo} from "../../../../domain/todo";
import {ensureIsNotRepeated, filterTodo} from "../../../../domain/services/todoQueries";

describe('The todo Queries', () => {
    const todoList: Todo[] = [
        {id: '1', text: 'Todo 1', completed: true},
        {id: '2', text: 'Todo 2', completed: false},
        {id: '3', text: 'Todo 3', completed: true},
        {id: '4', text: 'Todo 4', completed: false}
    ];

    describe('filterTodo', () => {
        it('should return all todos when filter is "all"', () => {
            const result = filterTodo(todoList, 'all');
            expect(result).toEqual(todoList);
        });

        it('should return only completed todos when filter is "completed"', () => {
            const result = filterTodo(todoList, 'completed');
            expect(result).toEqual([
                {id: '1', text: 'Todo 1', completed: true},
                {id: '3', text: 'Todo 3', completed: true}
            ]);
        });

        it('should return only incomplete todos when filter is "incomplete"', () => {
            const result = filterTodo(todoList, 'incomplete');
            expect(result).toEqual([
                {id: '2', text: 'Todo 2', completed: false},
                {id: '4', text: 'Todo 4', completed: false}
            ]);
        });
    });

    describe('ensureIsNotRepeated', () => {
       it('should throw an error if the todo text is already in the collection', () => {
              expect(() => {
                ensureIsNotRepeated(todoList, 'Todo 1');
              }).toThrow('The todo text is already in the collection.');
       });
       it('shoud not throw an error if the todo text is not in the collection', () => {
                expect(() => {
                    ensureIsNotRepeated(todoList, 'Todo 5');
                }).not.toThrow();
       });
    });
});
