# Frontend testing with legacy code

This project is a refactoring exercise for the Sustainable Testing course. It is designed to provide hands-on experience in applying best practices for sustainable testing within a modern development environment.

## Requirements

- Node.js
- NVM
## Getting Started

Before starting the project, you must switch to the correct Node version and install the necessary dependencies. Run the following commands in your terminal:


```
nvm use
npm install
```
## Script Commands

### Start Backend

To start the backend of the application in development mode, run:


```
npm run start:back
```
### Start Frontend

To start the frontend of the application in development mode, run:

```
npm run start:front
```
### End-to-End (E2E) Tests

To run the end-to-end tests using Cypress (remember to start the frontend and backend project before to execute it), run:

```
npm run test:e2e
```
Note: It is necessary to have both the frontend and backend running for the E2E tests to work.

### Unit Tests

To run the unit tests using Jest, run:


```
npm run test:unit
```
### Integration Tests

To run the integration tests using Jest, run:


```
npm run test:integration
```
### Run All Tests

To run all tests (E2E, integration, and unit) in one operation, run:

```
npm test
```
