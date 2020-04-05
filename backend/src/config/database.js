require('../bootstrap');

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV !== 'test' ? false : false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
