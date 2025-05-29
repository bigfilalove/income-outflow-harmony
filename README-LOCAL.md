
# Finance Tracker - Local Deployment

This is a fully autonomous version of the Finance Tracker application designed for local deployment on client servers.

## Features

- **Complete Autonomy**: No external dependencies or cloud services required
- **Local MongoDB Database**: All data stored locally for maximum privacy and control
- **JWT-based Authentication**: Secure local authentication system
- **Docker Deployment**: Easy deployment with Docker and Docker Compose
- **Data Migration**: Tools to migrate existing data from Supabase
- **Admin Interface**: Complete administrative control over users and system settings

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- At least 2GB RAM available
- 10GB disk space recommended

### Installation

1. **Download and extract** the application files to your desired directory

2. **Run the installation script**:

   **Linux/Mac:**
   ```bash
   chmod +x scripts/install.sh
   ./scripts/install.sh
   ```

   **Windows:**
   ```cmd
   scripts\install.bat
   ```

3. **Access the application** at `http://localhost:3000`

4. **Login with default admin credentials**:
   - Username: `admin`
   - Password: `admin123`

### Manual Installation

If you prefer manual installation:

1. Create directories:
   ```bash
   mkdir -p logs data/mongodb
   ```

2. Create `.env` file:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://admin:admin123@mongodb:27017/finance_tracker?authSource=admin
   JWT_SECRET=your-secure-secret-key-here
   PORT=3000
   ```

3. Start services:
   ```bash
   docker-compose up -d
   ```

## Configuration

### Environment Variables

- `NODE_ENV`: Application environment (production/development)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation (change this!)
- `PORT`: Application port (default: 3000)

### Database Configuration

The application uses MongoDB with the following default settings:
- Database: `finance_tracker`
- Username: `admin`
- Password: `admin123`
- Port: `27017`

## Data Migration

If you have existing data in a Supabase instance, you can migrate it using the built-in migration tools:

1. Access the admin panel after login
2. Navigate to System → Data Migration
3. Enter your Supabase credentials
4. Run the migration process

## User Management

### Default Users

The system comes with a default admin user:
- **Username**: admin
- **Password**: admin123
- **Role**: Administrator

**⚠️ Important**: Change the default admin password immediately after first login!

### Creating New Users

Administrators can create new users through:
1. Admin Panel → User Management
2. REST API endpoints
3. Direct database manipulation

### User Roles

- **Admin**: Full system access, user management, system configuration
- **User**: Standard access to financial features
- **Basic**: Limited access to core features

## Backup and Restore

### Automated Backups

The system can be configured for automated backups:

```bash
# Create backup
docker exec finance-tracker-mongodb mongodump --db finance_tracker --out /backup

# Restore backup
docker exec finance-tracker-mongodb mongorestore --db finance_tracker /backup/finance_tracker
```

### Manual Backup

```bash
# Export data
docker-compose exec mongodb mongodump --db finance_tracker --gzip --archive > backup-$(date +%Y%m%d).gz

# Import data
docker-compose exec -T mongodb mongorestore --db finance_tracker --gzip --archive < backup-20240101.gz
```

## Maintenance

### Log Management

- Application logs: `./logs/`
- Database logs: `docker-compose logs mongodb`
- Container logs: `docker-compose logs finance-tracker`

### Updates

To update the application:

1. Stop the services: `docker-compose down`
2. Update the application files
3. Rebuild and restart: `docker-compose up --build -d`

### Health Monitoring

- Health check endpoint: `http://localhost:3000/health`
- Database status: `docker-compose exec mongodb mongo --eval "db.adminCommand('ismaster')"`

## Security Considerations

### Production Deployment

For production deployment, ensure:

1. **Change default passwords**:
   - Admin user password
   - MongoDB admin password
   - JWT secret key

2. **Network Security**:
   - Use firewall rules to restrict access
   - Consider VPN access for remote users
   - Enable HTTPS with reverse proxy (nginx/Apache)

3. **Regular Backups**:
   - Set up automated daily backups
   - Test restore procedures regularly
   - Store backups securely off-site

4. **System Updates**:
   - Keep Docker and host OS updated
   - Monitor for application updates
   - Review security logs regularly

### Recommended Production Setup

```yaml
# Example nginx reverse proxy configuration
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**:
   ```bash
   # Change port in .env file
   PORT=3001
   ```

2. **MongoDB connection issues**:
   ```bash
   # Check MongoDB status
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Application won't start**:
   ```bash
   # Check application logs
   docker-compose logs finance-tracker
   
   # Rebuild application
   docker-compose up --build -d
   ```

### Log Analysis

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs finance-tracker
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f
```

## API Documentation

The application provides a REST API for integration with other systems:

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Transaction Endpoints

- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budget Endpoints

- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## Support

For technical support or questions:

1. Check the troubleshooting section above
2. Review application logs for error details
3. Consult the API documentation for integration issues
4. Contact your system administrator for deployment-specific issues

## License

This software is provided as-is for local deployment. Please ensure compliance with your organization's software usage policies.
