import {Server} from "./infrastructure/server";
import {TodoController} from "./infrastructure/controller";
import {TodoRepositoryInMemory} from "./core/todoRepository";

const todoRepository = new TodoRepositoryInMemory();
const todoController = new TodoController(todoRepository);
const server = new Server(todoController);
const PORT = 3000;

server.listen(PORT);
