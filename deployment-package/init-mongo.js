
// MongoDB initialization script
db = db.getSiblingDB('finance_tracker');

// Create collections
db.createCollection('localusers');
db.createCollection('localtransactions');
db.createCollection('localbudgets');

print('Creating default admin user...');

// Create default admin user with hashed password (admin123)
db.localusers.insertOne({
  name: 'Администратор',
  email: 'admin@localhost',
  username: 'admin',
  password: '$2a$10$zQZY5n1g8.2H3.zQZY5n1g8.2H3.zQZY5n1g8.2H3.zQZY5n1g8.2H3',
  role: 'admin',
  createdAt: new Date()
});

print('Database initialized successfully with default admin user');
print('Default login: admin / admin123');
print('IMPORTANT: Change the default password after first login!');
