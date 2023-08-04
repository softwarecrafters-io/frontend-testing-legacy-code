import {TodoApiRepository} from "../../../infrastructure/repositories/todoApiRepository";
import {createTodo, updateTodo} from "../../../domain/todo";

describe('TodoApiRepository Integration Test', () => {
    let todoApiRepository: TodoApiRepository;
    const baseUrl = 'http://localhost:3000/api/todos/'; // Asegúrate de que este es el URL real de tu API

    beforeEach(() => {
        todoApiRepository = new TodoApiRepository(baseUrl);
    });

    afterEach(async () => {
        const todos = await todoApiRepository.getAll();
        todos.forEach(async todo => await todoApiRepository.delete(todo));
    });

    it('should fetch all todos', async () => {
        const addedTodo = await todoApiRepository.add(createTodo('New todo'));

        const todos = await todoApiRepository.getAll();
        expect(todos).toEqual([addedTodo]);
    });

    it('should add a new todo', async () => {
        const addedTodo = await todoApiRepository.add(createTodo('New todo'));
        expect(addedTodo.text).toEqual(createTodo('New todo').text);
        expect(addedTodo.completed).toEqual(createTodo('New todo').completed);
    });

    it('should update a todo', async () => {
        const existingTodo = await todoApiRepository.add(createTodo('New todo'));
        const updatedTodo = updateTodo(existingTodo,'Updated todo');

        const result = await todoApiRepository.update(updatedTodo);

        expect(result.text).toEqual('Updated todo');
    });

    it('should delete a todo', async () => {
        const existingTodo = await todoApiRepository.add(createTodo('New todo'));
        await todoApiRepository.delete(existingTodo);

        expect(todoApiRepository.getAll()).not.toContain(existingTodo);
    });
});
