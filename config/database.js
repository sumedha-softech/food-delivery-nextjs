import { Sequelize } from 'sequelize';
import tedious from 'tedious';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    dialectModule: tedious,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      },
    },
    logging: false,
  }
);

export default sequelize;
