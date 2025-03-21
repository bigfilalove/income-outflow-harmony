
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const jwt = require('jsonwebtoken');
const port = 3001;

const JWT_SECRET = 'your-secret-key-123'; // In a real app, use an environment variable

// Set up custom middlewares
server.use(jsonServer.bodyParser);

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Login endpoint
server.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const db = router.db;
  const user = db.get('users').find({ username, password }).value();
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role,
      name: user.name
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    token
  });
});

// Register endpoint
server.post('/auth/register', (req, res) => {
  const { name, email, username, password, role = 'basic' } = req.body;
  
  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const db = router.db;
  
  // Check if user already exists
  const exists = db.get('users').find({ username }).value();
  if (exists) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email, 
    username,
    password,
    role,
    createdAt: new Date().toISOString()
  };
  
  db.get('users').push(newUser).write();
  
  // Create token
  const token = jwt.sign(
    { 
      id: newUser.id, 
      username: newUser.username,
      role: newUser.role,
      name: newUser.name
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    username: newUser.username,
    role: newUser.role,
    token
  });
});

// Secure all transaction endpoints
server.use('/transactions', authenticate);
server.use('/transactions/*', authenticate);

// Set up custom routes for transaction status update
server.patch('/transactions/:id/status', (req, res) => {
  const db = router.db;
  const id = req.params.id;
  const { reimbursementStatus } = req.body;
  
  const transaction = db.get('transactions').find({ id }).value();
  
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  const updatedTransaction = { ...transaction, reimbursementStatus };
  db.get('transactions').find({ id }).assign(updatedTransaction).write();
  
  res.json(updatedTransaction);
});

// Use default middlewares
server.use(middlewares);

// Use router (after custom routes)
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}`);
  console.log(`Auth endpoints: http://localhost:${port}/auth/login and http://localhost:${port}/auth/register`);
  console.log(`Resources: http://localhost:${port}/transactions (requires authentication)`);
  console.log(`Resources: http://localhost:${port}/users`);
});
