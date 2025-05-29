
// MongoDB initialization script
db = db.getSiblingDB('finance_tracker');

// Create collections
db.createCollection('localusers');
db.createCollection('localtransactions');
db.createCollection('localbudgets');
db.createCollection('companies');
db.createCollection('categories');
db.createCollection('projects');

// Create default admin user
db.localusers.insertOne({
  name: 'Администратор',
  email: 'admin@localhost',
  username: 'admin',
  password: '$2a$10$zQZY5n1g8.2H3.zQZY5n1g8.2H3.zQZY5n1g8.2H3.zQZY5n1g8.2H3', // hashed 'admin123'
  role: 'admin',
  createdAt: new Date()
});

// Create default categories
db.categories.insertMany([
  { name: 'Продажи', type: 'income' },
  { name: 'Инвестиции', type: 'income' },
  { name: 'Прочие доходы', type: 'income' },
  { name: 'Зарплата', type: 'expense' },
  { name: 'Аренда', type: 'expense' },
  { name: 'Коммунальные услуги', type: 'expense' },
  { name: 'Реклама и маркетинг', type: 'expense' },
  { name: 'Канцелярские товары', type: 'expense' },
  { name: 'Транспорт', type: 'expense' },
  { name: 'Питание', type: 'expense' },
  { name: 'Прочие расходы', type: 'expense' }
]);

// Create default companies
db.companies.insertMany([
  { name: 'Основная компания' },
  { name: 'Филиал 1' },
  { name: 'Филиал 2' }
]);

// Create default projects
db.projects.insertMany([
  { name: 'Проект А' },
  { name: 'Проект Б' },
  { name: 'Проект В' }
]);

print('Database initialized successfully');
