
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

## API Endpoints

The mock server provides the following endpoints:

- `GET /transactions` - Get all transactions
- `GET /transactions/:id` - Get a specific transaction
- `POST /transactions` - Create a new transaction
- `DELETE /transactions/:id` - Delete a transaction
- `PATCH /transactions/:id/status` - Update a transaction's reimbursement status
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user

## Development

This project uses:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for data fetching
- JSON Server for the mock API
