import express, { Express, Router } from 'express';
import cors from 'cors';
import { TodoController } from './controller';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs';

export class Server {
    private app: Express;
    private todoController: TodoController;

    constructor(todoController: TodoController) {
        this.todoController = todoController;
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.setupRoutes();
        this.setupSwagger();
    }

    private setupSwagger(): void {
        const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../swagger.json'), 'utf8'));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private setupRoutes(): void {
        const router = Router();
        router.get('/', this.todoController.getAllTodos);
        router.post('/', this.todoController.createTodo);
        router.delete('/:id', this.todoController.deleteTodo);
        router.put('/:id', this.todoController.updateTodo);
        this.app.use('/api/todos', router);
    }

    listen(port: number): void {
        this.app.listen(port, () => console.log(`Server running on port ${port}`));
    }
}
