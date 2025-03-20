
#!/bin/bash

# Script for building the project for deployment

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create deployment package
echo "Creating deployment package..."
mkdir -p deployment
cp -r dist deployment/
cp DEPLOYMENT.md deployment/
cp package.json deployment/

echo "Build complete! Deployment package is ready in the 'deployment' directory."
echo "Please refer to DEPLOYMENT.md for deployment instructions."
