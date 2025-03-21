
# Finance Management Application

This is a finance management application for tracking income, expenses, and reimbursements.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- npm (comes with Node.js)
- MongoDB installed locally (or a MongoDB Atlas account)

### Running the Application

1. **Configure MongoDB**
   Create a .env file from .env.example and configure your MongoDB connection string.
   ```
   cp .env.example .env
   ```
   Edit the .env file with your MongoDB connection details.

2. **Seed the Database (Optional)**
   ```
   node src/server/seed.js
   ```
   This will populate your MongoDB with initial sample data.

3. **Start the Express Server**
   ```
   node start-mongo-server.js
   ```
   This will start an Express server connected to MongoDB on port 3001.

4. **In a separate terminal, start the application**
   ```
   npm run dev
   ```
   The application will be available at http://localhost:5173 (or another port shown in your terminal).

## Features
- Track income and expenses
- Manage reimbursements
- View financial analytics
- User management for admins
- JWT Authentication for API security
- MongoDB as database backend

## API Endpoints

The server provides the following endpoints:

### Authentication Endpoints
- `POST /auth/login` - Login with username/password, returns JWT token
- `POST /auth/register` - Register a new user, returns JWT token

### Protected Endpoints (require JWT token)
- `GET /transactions` - Get all transactions
- `POST /transactions` - Create a new transaction
- `DELETE /transactions/:id` - Delete a transaction
- `PATCH /transactions/:id/status` - Update a transaction's reimbursement status

### Admin Endpoints
- `GET /users` - Get all users (admin only)

## Authentication

All transaction-related API endpoints require authentication. Include a JWT token in your request headers:

```
Authorization: Bearer <your-token>
```

The token is obtained by logging in or registering through the `/auth/login` or `/auth/register` endpoints.

## Development

This project uses:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for data fetching
- Express for the API server
- MongoDB for the database
- JWT for API authentication
