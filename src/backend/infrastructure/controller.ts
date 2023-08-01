import { Request, Response } from 'express';
import { TodoRepositoryInMemory } from '../core/todoRepository';
import {Todo} from "../core/todo";

export class TodoController {
    constructor(private repository: TodoRepositoryInMemory) {}

    getAllTodos = (req: Request, res: Response): void => {
        res.json(this.repository.getAll());
    };

    createTodo = (req: Request, res: Response): void => {
        const { id, text, completed } = req.body;
        const todo = new Todo(id, text, completed);
        this.repository.add(todo);
        res.status(201).json(todo)
    };

    deleteTodo = (req: Request, res: Response): void => {
        this.repository.delete(req.params.id);
        res.status(204).end();
    };

    updateTodo = (req: Request, res: Response): void => {
        try{
            this.repository.update(req.params.id, req.body);
            res.json(req.body);
        }
        catch(e){
            res.status(404).json({ error: 'Todo not found' });
        }
    };
}
