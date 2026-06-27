require('dotenv').config();

const password = process.env.DB_PASSWORD || process.env.PASSWORD;
const host = process.env.HOST || '127.0.0.1';

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password,
    database: process.env.DATABASE_DEVELOPMENT || 'sikap_development',
    host,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password,
    database: process.env.DATABASE_TEST || 'sikap_test',
    host,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password,
    database: process.env.DATABASE_PRODUCTION || 'sikap_production',
    host,
    dialect: 'mysql',
  },
};
