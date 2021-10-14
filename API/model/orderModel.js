'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

//Jaktojalostuksessa lisätään tietokantaan kaikki käyttäjän syöttämät tiedot
const postOrder = async (params) => {
    try {
        const sql = 'INSERT INTO orders (Name, Price, Email, products) VALUES (?, ?, ?, ?)';
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    } catch (error) {
        console.log("Error while posting order ", error.message);
        return {error: "Error while posting order to database"}
    }
};

module.exports = {
    postOrder
}
