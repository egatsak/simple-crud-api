# Simple CRUD API

## Simple CRUD server app built with Node.js & Typescript

[Link to the assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

### How to run

- Please clone this repository
- Go to app folder `cd simple-crud-api`
- Run `npm install` to install the dependencies
- Add `.env` file to the root folder containing the next variables:

  `PORT=5000`

  `NODE_ENV=development`

  `BASE_URL=http://localhost`

Use the following scripts:

- `npm run start:dev` to start the server app in development mode;

- `npm run test` to run tests;

- `npm run start:prod` to build the app and start in production mode;

- `npm run start:multi` to run the Load Balancer (the last task in the assignment) and multiple instances of the server app

### Endpoints

- GET `api/users` is used to get all users

- GET `api/users/${userId}` is used to get particular user by ID

- POST `api/users` is used to create record about new user and store it in database

- PUT `api/users/${userId}` is used to update existing user

- DELETE `api/users/${userId}` is used to delete existing user from database

### How to test

Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to send HTTP requests.

In the root folder you can find `Insomnia_doc.json` - you can use it if you prefer Insomnia (as me).

Default URL will be `http://localhost:5000/api/users`

When you test the Load Balancer, please keep in mind that the instances of node.js will run in several seconds after the script has started (you can observe the logs in the console).

## References

[RS School](https://rs.school/)
