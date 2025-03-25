
#!/bin/bash

# Make script exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Starting server..."
node start-mongo-server.js
