module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'app',
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
  },
};