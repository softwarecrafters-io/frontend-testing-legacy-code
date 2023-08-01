
describe('TodoList App', () => {
  const todoText = 'Irrelevant task';
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('h1', 'TODOLIST APP');
  });


});

