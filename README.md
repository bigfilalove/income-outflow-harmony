
# Finance Management Application

This is a finance management application for tracking income, expenses, and reimbursements.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- npm (comes with Node.js)

### Running the Application

1. **Start the Mock API Server**
   ```
   node start-mock-server.js
   ```
   This will start a JSON server on port 3001 with sample data.

2. **In a separate terminal, start the application**
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

## API Endpoints

The mock server provides the following endpoints:

### Authentication Endpoints
- `POST /auth/login` - Login with username/password, returns JWT token
- `POST /auth/register` - Register a new user, returns JWT token

### Protected Endpoints (require JWT token)
- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get a specific transaction
- `POST /transactions` - Create a new transaction
- `DELETE /transactions/:id` - Delete a transaction
- `PATCH /transactions/:id/status` - Update a transaction's reimbursement status

### Public Endpoints
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user

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
- JSON Server for the mock API
- JWT for API authentication
