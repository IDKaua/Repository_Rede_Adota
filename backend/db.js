// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Testar a ligação
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao adquirir o cliente PostgreSQL', err.stack);
    }
    console.log('Ligação à base de dados PostgreSQL estabelecida com sucesso!');
    release();
});

module.exports = pool;