# Personal Finance Tracker App Server

![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v4.4.4-blue)
![Express](https://img.shields.io/badge/Express-v4.17.1-lightgrey)
![TypeORM](https://img.shields.io/badge/TypeORM-v0.2.38-orange)
![MySQL](https://img.shields.io/badge/MySQL-v8.0.25-blue)

Welcome to the Personal Finance Tracker App Server! This server serves as the backend for your personal finance tracker application. It provides various endpoints for managing user accounts and financial transactions.

## Features

- User registration and authentication with JWT.
- Create, update, and filter transactions by date range.
- Pagination support for transactions.
- Get transaction summaries grouped by categories, including balance, total expenses, and total income.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

- **Yarn:** We recommend using Yarn as the package manager. You can install it globally by running:

  ```bash
  npm install -g yarn
  ```

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Loraklvn/finance_tracker.git
   ```

2. Change into the project directory:

   ```bash
   cd personal-finance-tracker-server
   ```

3. Install project dependencies:

   ```bash
   yarn install
   ```

4. Create an `.env` file in the project root directory and add the following environment variables with your own values:

   ```dotenv
    APP_PORT=4000
    DB_CONNECTION_HOST=us-cdbr-east-06.cleardb.net
    DB_CONNECTION_PORT=3306
    DB_CONNECTION_DB_NAME=heroku_76dd0eb135febfc
    DB_CONNECTION_USERNAME=bd13b9b6f54f96
    DB_CONNECTION_DB_PASSWORD=ab94b6c3
    ACCESS_TOKEN_SECRET=trwyutyiruiorio7opklfmcmjvtfweujelvljvhgkvoijhtijogjighhjjhmpku
    FRONT_END_APP_URI=http://localhost:5173
   ```

   I provided the values for you to be able to connect to a remote dev database, but feel free to use a local db.

## Usage

To run the server, you have several scripts available in the `package.json`:

- **Start the server:**

  ```bash
  yarn start
  ```

- **Run the server in development mode (with auto-restart):**

  ```bash
  yarn dev (or npm run dev)
  ```

- **Watch for TypeScript file changes:**

  ```bash
  yarn watch
  ```

- **Build the TypeScript project:**

  ```bash
  yarn build
  ```

- **Lint the TypeScript code:**

  ```bash
  yarn lint
  ```

Make sure to use the appropriate script according to your needs.

## API Endpoints

- **POST /register**: Create a new user account.
- **POST /login**: Authenticate and receive a JWT token.
- **POST /transaction**: Create a new financial transaction.
- **PUT /transaction/:id**: Update an existing financial transaction.
- **DELETE /transaction/:id**: Delete an existing financial transaction.
- **GET /transaction**: Retrieve transactions with optional filtering and pagination.
- **GET /transaction/summary**: Get a summary of balance, total expenses and total income with optional filtering.
- **GET /transaction/summary/category**:Get a summary of expenses grouped by categories.
- **GET /category**: Retrieve a list of general categories and categories created by the user.
- **POST /category/**: Create a new category assigned to the user.

Please refer to the API documentation or source code for additional details on how to use these endpoints.

## Note

This project currently lacks unit testing due to time constraints. While I would have preferred to include comprehensive unit tests, the project had to be submitted without them.

Additionally, there are several areas where improvements could be made if more time were available.

I appreciate your understanding.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
