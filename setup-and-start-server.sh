
#!/bin/bash

# Make script exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Starting server..."
echo "Note: Make sure you have a valid MongoDB connection string in your .env file"
node start-mongo-server.js
