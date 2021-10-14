'use strict';

require('dotenv').config({ path: require('find-config')('.env') })


const mysql = require('mysql2');

/**
 * React projektiin lisätty tietokantayhteyden tiedot .env tiedostoon ja lisätty dotenv niitä lukemaan
 * @type {Pool}
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
