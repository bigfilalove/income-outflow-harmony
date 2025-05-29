
#!/bin/bash

# Finance Tracker Local Installation Script
set -e

echo "=== Finance Tracker Local Installation ==="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p data/mongodb

# Set permissions
chmod 755 logs
chmod 755 data/mongodb

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
NODE_ENV=production
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
JWT_SECRET=finance-tracker-$(openssl rand -hex 32)
PORT=3000
EOL
    echo ".env file created with secure JWT secret"
fi

# Build and start services
echo "Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Installation completed successfully!"
    echo ""
    echo "🎉 Finance Tracker is now running on: http://localhost:3000"
    echo ""
    echo "Default admin credentials:"
    echo "Username: admin"
    echo "Password: admin123"
    echo ""
    echo "Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Update application: docker-compose pull && docker-compose up -d"
else
    echo "❌ Installation failed. Check logs with: docker-compose logs"
    exit 1
fi
