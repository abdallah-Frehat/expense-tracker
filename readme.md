 Expense Tracker Web Application

This document describes the work I did while building the Expense Tracker Web Application. I started by setting up the project and connecting the server to the database, then I worked on the Backend and Frontend and added the main features of the application.

 Phase 0: Project Setup and Database Connection

In the first phase I focused on preparing the project and making sure that the server could connect to the PostgreSQL database correctly.

 1. Project Setup

I created a new Node.js project and installed the main packages needed for the project:

- Express – used to create the server and API.
- CORS – used to allow communication between the Frontend and Backend.
- pg – used to connect Node.js with PostgreSQL.
- dotenv – used to read the database settings from the `.env` file.

 2. Database Setup

I created a PostgreSQL database called expense_tracker.

I also created a db.js file to connect the application to PostgreSQL using a connection pool.

After that, I checked the database connection settings to make sure everything was configured correctly.

 3. Creating the Server

I created the server.js file and set up the Express server.

The server runs on port 3000.

I also added a test endpoint:

GET /api/test-db

This endpoint was used to check if the server could connect to the database successfully.

 4. Testing the Connection

I created a simple HTML page using Bootstrap and JavaScript.

The JavaScript uses fetch() to send a request to the Backend.

I used this to check that:

- The Frontend can communicate with the Backend.
- The Backend can connect to PostgreSQL.
- The database connection result can be displayed on the page.


 Phase 1: Building the Backend API

After making sure that the project and database connection were working, I started building the Backend API for managing expenses.

 1. Environment File

I created a .env file to store the database connection information instead of writing it directly inside the code.


DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker

This made the database settings easier to manage.

 2. Creating the Expenses Table

I created the expenses table in PostgreSQL.

I also created a schema.sql file that contains the SQL commands used to create the required database table.

 3. Writing Database Queries

While working with the database, I used parameterized queries such as $1 and $2 instead of putting values directly inside the SQL query.

This also helps protect the application from SQL Injection.

I used RETURNING when inserting and updating records so I could get the updated data directly from PostgreSQL.

I also used TO_CHAR when I needed to format dates.

 4. Creating the Expenses API

I created the following API endpoints:

- GET /api/expenses – get all expenses.
- GET /api/expenses/:id – get one expense by ID.
- POST /api/expenses – add a new expense.
- PUT /api/expenses/:id – update an existing expense.
- DELETE /api/expenses/:id – delete an expense.

I also added input validation and used different HTTP status codes depending on the result, such as 200, 201, 400, and 404.

 5. Testing the API with Thunder Client

Before connecting the Frontend, I tested the API using Thunder Client in VS Code.

I started the Node.js server from the Terminal and checked that it was running correctly.

Then I created requests in Thunder Client for:

- GET
- POST
- PUT
- DELETE

For POST and PUT requests, I sent the data as JSON in the request Body.

I checked the response and status code for each request.

I also made sure that adding, updating, deleting, and getting expenses were working correctly with the PostgreSQL database before moving to the Frontend.


 Phase 2: Connecting the Frontend with the Backend

After finishing and testing the API, I started connecting the Frontend with the Backend.

1. Frontend Interface

I created the interface using HTML and Bootstrap 5.

The page contains:

- Total Expenses card.
- Number of Expenses card.
- Highest Expense card.
- Form for adding expenses.
- Expenses table.

 2. Getting Data from the Backend

I used JavaScript fetch() with async/await to communicate with the API.

When the page loads, the application sends a request to the Backend and gets the expenses from PostgreSQL.

The data is then displayed inside the table.

The statistics cards are also updated based on the expense data.

 3. Adding, Updating, and Deleting Expenses

I connected the Add Expense form to the POST API.

For editing an expense, I used a Bootstrap Modal where the existing data can be changed and then sent to the Backend using the PUT API.

I also added a delete option that sends a DELETE request to the Backend.

After a successful operation, the table and statistics are updated so the new data appears directly on the page.

 4. Data Validation

I added some basic validation before sending data to the server.


- Required fields cannot be empty.
- Expense amount cannot be zero.
- Negative amounts are not allowed.

I also used try/catch to handle errors that may happen while communicating with the server.


 Phase 3: Additional Features

After completing the main functionality, I added some extra features to improve the application.

 1. Toast Notifications

I replaced the normal browser alert() and confirm() messages with Toast Notifications.

They are used to show messages such as:

- Expense added successfully.
- Expense updated successfully.
- Expense deleted successfully.
- An error occurred.

This made the messages look more suitable for the application.

 2. Dark Mode

I added a Light/Dark Mode option.

I used Bootstrap:

data-bs-theme

together with custom CSS to change the appearance of the page.

I also used localStorage so the selected theme is saved in the browser.

This means that when the user opens the application again, the selected theme can be kept.

 3. Search and Filtering

I added a search field that allows the user to search for expenses by title.

The search can be done using the search button or by pressing Enter.

The table is filtered based on the entered title.

 4. Responsive Design

I added responsive CSS to make the application work better on different screen sizes.

The cards, form, table, and other elements adjust depending on the screen size.

I also made sure that the interface works with both Light Mode and Dark Mode on desktop and mobile screens.


How to Run the Project

 1. Database Setup

First, open pgAdmin and create a PostgreSQL database called:

expense_tracker

Then open the schema.sql file and execute the SQL commands to create the required tables.

 2. Running the Backend

Open the project in VS Code and open the Terminal.

Go to the Backend folder:

cd backend

Install the required packages:

npm install

Make sure the .env file contains the correct database settings:

DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker

Then start the server:

node server.js

If a start script is configured in package.json the server can also be started with:

npm start

The Backend will be available at:

http://localhost:3000

3. Running the Frontend

Open the frontend folder in VS Code.

Open index.html using Live Server.

After opening the page, I can test the main functions of the application, including:

- Adding an expense.
- Editing an expense.
- Deleting an expense.
- Searching for an expense.
- Checking the statistics.
- Switching between Light Mode and Dark Mode.
- Checking the Toast Notifications.

Conclusion

During this project I worked on both the Backend and Frontend parts of the Expense Tracker Web Application.

I practiced working with Node.js, Express, PostgreSQL, REST APIs, JavaScript, Bootstrap, and database queries.

I also learned how to connect the Frontend with the Backend, test APIs using Thunder Client, validate user input, and work with data stored in a PostgreSQL database.


 Challenges and Solutions

While working on the Expense Tracker Web Application, I faced a few problems and solved them as follows:
 
1. Frontend and Backend Connection

- Problem:
I needed to make sure that the Frontend and Backend worked correctly when adding, editing, deleting, and getting expenses.

- Solution:
I used fetch() with async/await and try/catch to handle the API requests and errors.

- Result:
The CRUD operations worked correctly, and Toast Notifications showed the result of each operation.

 2. SQL Injection and Data Validation

- Problem:
I needed to handle user input safely and prevent invalid expense amounts.

- Solution:
I used $1 and $2 in SQL queries and added validation for the expense amount.

- Result:
The data is handled more safely, and zero or negative amounts are not accepted.

3. Dark Mode

- Problem:
Some cards and table text were not clear when Dark Mode was enabled because of Bootstrap styles.

- Solution:
I added custom CSS and used !important where needed to fix the colors.

- Result:
The text, cards, and table became clear and easier to read in Dark Mode.


 Project Demo

Watch the project demo video:(https://drive.google.com/file/d/1Qz-d6B-wAcFTUSjO9u9U5AOpfR1OIQ_U/view?usp=sharing)

 GitHub Repository

View the project on GitHub:(https://github.com/abdallah-Frehat/expense-tracker)