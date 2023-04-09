const mysql = require('mysql2/promise');
const { logger } = require('../middlewares/logger/config/logger');

const { MYSQL_HOST, MYSQL_USER, MYSQL_PW, MYSQL_DB } = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PW,
  database: MYSQL_DB,
  connectTimeout: 5000,
  connectionLimit: 30,
  dateStrings: 'date',
});

module.exports = {
  async execute(sql, params) {
    try {
      const [rows, fields] = await pool.execute(sql, params);
      logger.debug(`DB execute success : ${sql}, ${params}`);
      return rows;
    } catch (error) {
      logger.error(`DB execute error :  ${error}`);
    }
  },
};
