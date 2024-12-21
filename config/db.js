const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize  = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // Disable SQL logging
      }
);

sequelize.authenticate()
.then(()=>console.log('Connected DB Successfully...'))
.catch(()=>console.log('Error While Connecting DB'))

module.exports = sequelize;