
describe('TodoList App', () => {
  const todoText = 'Irrelevant task';
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('h1', 'TODOLIST APP');
  });

  it('should be able to add a new todo', () => {
    cy.get('.todo-input').type(todoText);
    cy.get('.add-todo-button').click();

    cy.get('.todo-delete-button').click();

    cy.contains('.todo-list-item', todoText).should('not.exist');
  });

  it('should be able to delete a todo', () => {
    cy.get('.todo-input').type(todoText);
    cy.get('.add-todo-button').click();
    cy.get('.todo-list-item').should('contain', todoText);

    cy.get('.todo-delete-button').first().click();
    cy.contains('.todo-list-item', todoText).should('not.exist');
  });

  it('should be able to mark a todo as complete', () => {
    cy.get('.todo-input').type(todoText);
    cy.get('.add-todo-button').click();

    cy.get('.todo-mark-button').click();

    cy.get('.todo-mark-button').should('contain', 'Mark as Incomplete');

    cy.get('.todo-delete-button').click();
    cy.contains('.todo-list-item', todoText).should('not.exist');
  });
});

