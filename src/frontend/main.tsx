import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './todo/todoApp.css'
import './index.css'
import {TodoApp} from "./todo/todoApp";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,
)
