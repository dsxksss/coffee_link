const { Pool } = require('pg');

const dbInstance = new Pool({
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

module.exports = {dbInstance};