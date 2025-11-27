# POS Backend

This is the backend API for the POS (Point of Sale) application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pos_db
ALLOWED_ORIGIN=http://localhost:3000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

- `PORT`: The port on which the server will run.
- `MONGO_URI`: The connection string for your MongoDB database.
- `ALLOWED_ORIGIN`: Comma-separated list of allowed origins for CORS (e.g., frontend URL).
- `JWT_SECRET`: Secret key for signing JSON Web Tokens.
- `NODE_ENV`: Environment mode (`development` or `production`).

## Running the Project

To start the server:

```bash
npm start
```

The server will start on the specified `PORT` (default: 5000).

## Seeding Data

To populate the database with initial data (Warehouses, Units, Taxes, Categories, Materials):

```bash
node seeder.js
```

> **Note:** This command will clear existing data in the specified collections before seeding.
