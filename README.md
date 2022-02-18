# News API

## Project summary
This project is an API which provides the backend service for a news site. The API interacts with a PostgreSQL database and enables CRUD functionality on articles, topics, users, and comments, as well as full error handling. 

Visit my hosted version using the link below to see a summary of available endpoints, and to interact with the API.

## Hosted app
https://chl0e-g-news-app.herokuapp.com/api

## Technologies and tools used
* Node.js
* PostgreSQL database
* Express server
* TDD - unit testing & integration testing (using Jest and Supertest NPM packages)
* Heroku hosting

## Local setup instructions
1. Fork and clone the repo
2. Run `npm install` to install dependencies
3. Estabish the database connection following the instructions within 'Database connection setup' below
4. Run `npm run seed` to seed the local database
5. To run tests:
    a. Run `npm test utils` to run unit tests for database utility functions
    b. Run `npm test app` to run integration tests for app

### Database connection setup
This repo uses environment variables to connect to the test and development databases locally. After cloning this repo, create the following .env files in the root directory:

| File             | Contents                             |
| ---------------- | ------------------------------------ |
| .env.test        | PGDATABASE=<test_database_name_here> |
| .env.development | PGDATABASE=<dev_database_name_here>  |

### Minimum version requirements
* Node.js v16.13.0
* Postgres v14.1