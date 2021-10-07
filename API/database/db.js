'use strict';

require('dotenv').config({ path: require('find-config')('.env') })

/**
 * @constant
 */
const mysql = require('mysql2');
/*
process.env.DB_HOST = 'mysql.metropolia.fi';
process.env.DB_USER = 'paulivu';
process.env.DB_PASS = 'sqlpw12345';
process.env.DB_NAME = 'paulivu';

 */
/**
 * sql yhteyden asetukset
 * @constant
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
