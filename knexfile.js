// Update with your config settings.

require('dotenv').config();

const masterConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: './migrations',
  },
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: { ...masterConfig },
  testing: { ...masterConfig },
  production: { ...masterConfig },
};