# dot.Cards Assessment
This project is part of an assessment for dotCards interview process

## Technical requirements - status

* [x] Build DB using schema from JSON - On `npm start`, table and columns are created if doesn't exists already.
* [x] CRUD APIs - As requested there are 4 APIs, POST - create, GET - get details, POST - update, DELETE - delete the record. 
* [x] Check for the existence of the tables - A middleware checks if the table exists before each request.
* [x] SQLite as DBMS
* [x] Tests - Used Jest to test 4 APIs in two ways

The current schema does not support constraints such as primary keys or unique values. I believe that changing the schema through code is a bad design choice. Instead, I recommend that the schema be designed first, and then migrations be written for each change. This will allow us to roll back changes if something goes wrong in production.

If proper precautions are not taken, the application could be vulnerable to SQL injection attacks.

### Concurrency
I sent you an email about this, but I haven't heard back yet. I wasn't sure what type of concurrency you were expecting.

If you mean concurrent requests, then I've already handled that. I assumed that we don't need any transactions, so we don't need to use database transaction statements. This means that each API will get its own database connection object and close it at the end. This will prevent any conflicts between concurrent requests.

### How to start the server?

1) Install packages - One time setup
  
  ```
  npm install
  ```

2) Run server

  ```
  npm start
  ```
Listens on port 3000

### How to run tests?
  
  ```
  npm test  
  ```
