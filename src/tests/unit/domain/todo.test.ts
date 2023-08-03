import {createTodo, updateTodo} from "../../../domain/todo";

describe('The Todo model', ()=>{
    describe('when creating a todo', ()=>{
        it('should throw an error when a given text is less than minimum length', ()=>{
            const text = 'A';
            expect(()=>createTodo(text)).toThrowError(`Error: The todo text must be between 3 and 100 characters long.`);
        });

        it('should throw an error when a given text is more than maximum length', ()=>{
            const text = 'A'.repeat(101);
            expect(()=>createTodo(text)).toThrowError(`Error: The todo text must be between 3 and 100 characters long.`);
        });

        it('should throw an error when a given text is empty', ()=>{
            const text = '';
            expect(()=>createTodo(text)).toThrowError(`Error: The todo text must be between 3 and 100 characters long.`);
        });

        it('should throw an error when a given text is null', ()=>{
            const text = null;
            expect(()=>createTodo(text)).toThrowError(`Error: The todo text must be between 3 and 100 characters long.`);
        });

        it('should throw an error when a given text is not alphanumeric', ()=>{
            const text = 'A valid todo text with special characters: !@#$%^&*()_+';
            expect(()=>createTodo(text)).toThrowError('Error: The todo text can only contain letters, numbers, and spaces.');
        });

        it('should throw an error when a given text contains a prohibited word', ()=>{
            const text = 'A valid todo text with a prohibited word';
            expect(()=>createTodo(text)).toThrowError(`Error: The todo text cannot include a prohibited word.`);
        });
    });
    describe('when updating a todo', ()=>{
        it('should create a todo when a given text is valid', ()=>{
            const text = 'A valid todo text';
            const todo = createTodo(text);

            expect(todo.id).toMatch(/^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/);
            expect(todo.text).toMatch(text);
            expect(todo.completed).toBe(false);
        });

        it('should throw an error when a given text is more than maximum length', ()=>{
            const todo = createTodo('A valid todo text');

            expect(()=>updateTodo(todo, 'a')).toThrowError(`Error: The todo text must be between 3 and 100 characters long.`);
        });

        it('should throw an error when a given text is not alphanumeric', ()=>{
            const todo = createTodo('A valid todo text');
            const newText = 'A valid todo text with special characters: !@#$%^&*()_+';
            expect(()=>updateTodo(todo, newText)).toThrowError('Error: The todo text can only contain letters, numbers, and spaces.');
        });

        it('should throw an error when a given text contains a prohibited word', ()=>{
            const todo = createTodo('A valid todo text');
            const newText = 'A valid todo text with a prohibited word';
            expect(()=>updateTodo(todo, newText)).toThrowError(`Error: The todo text cannot include a prohibited word.`);
        });
    })
});
