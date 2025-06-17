const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'gondola.proxy.rlwy.net',
  port: 27706,
  user: 'root',
  password: 'zuaZZfFgDAYWmfGlXWMiEKmWNmTWOKyr',
  database: 'railway'
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error:', err.stack);
    return;
  }
  console.log('Connected as id', connection.threadId);
});

// Example query
connection.query('SHOW TABLES', (err, results) => {
  if (err) throw err;
  console.log(results);
});