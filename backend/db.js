// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'rede_adota'
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