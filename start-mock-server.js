
const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 3001;

// Set up custom routes for transaction status update
server.use(jsonServer.bodyParser);
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

// Use default middlewares (CORS, etc)
server.use(middlewares);

// Use router
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}`);
  console.log(`Resources: http://localhost:${port}/transactions`);
  console.log(`Resources: http://localhost:${port}/users`);
});
