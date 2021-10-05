'use strict';
/**
 * @constant {string} pool
 * @type {Pool}
 */
const pool = require('../database/db');
/**
 * @constant
 * @type {Pool}
 */
const promisePool = pool.promise();
/** Kotisivun featured tuotteiden tietokanta kyselyt
 * @async
 * @returns {Promise<{error: string}|RowDataPacket[][]|RowDataPacket[]|OkPacket|OkPacket[]|ResultSetHeader>}
 * Palauttaa kotisivun featured tuotteiden tiedot tietokannasta tai errorin jos sql kysely ei onnistu
 */
const getFeatured = async () => {
    try {
        const sql = 'SELECT * FROM product WHERE featured = 1';
        const [rows] = await promisePool.query(sql);
        return rows;
    } catch (e) {
        console.log("Error getting featured products: ", e.message);
        return {error: "Database error while fetching featured products"};
    }
};
/** Tuotteiden tietokantaan sql kyselyt valitun kategorian mukaan
 * @async
 * @param {string} category_name
 * @returns {Promise<{error: string}|RowDataPacket[][]|RowDataPacket[]|OkPacket|OkPacket[]|ResultSetHeader>}
 * Palauttaa tuotteet haetun kategorian mukaaan tai errorin jos sql kysely ei onnistu
 */
const getByCategory = async (category_name) => {
    try {
        const sql = 'SELECT * FROM product WHERE Category_id IN (SELECT Category_id FROM category WHERE Category_name = ?)';
        const [rows] = await promisePool.query(sql, [category_name]);
        return rows;
    } catch (e) {
        console.log("Error getting products by category: ", e.message);
        return {error: "Database error while fetching products by category"};
    }
};

/*
SELECT * FROM product
WHERE Category_id IN
(
	SELECT Category_id FROM category
	WHERE Category_name = 'GPU'
)
 */
/** Tuotteiden tietokantaan sql kyselyt tietyn id:n mukaan
 * @async
 * @param {number} product_id
 * @returns {Promise<{error: string}|RowDataPacket[][]|RowDataPacket[]|OkPacket|OkPacket[]|ResultSetHeader>}
 * Palauttaa valitun id:n mukaiset tuotteet tietokannasta tai errorin jos sql kysely ei onnistunut
 */
const getById = async (product_id) => {
    try {
        const sql = 'SELECT * FROM product WHERE Product_id = ?';
        const [rows] = await promisePool.query(sql, [product_id]);
        return rows;
    } catch (e) {
        console.log("Error getting product by id: ", e.message);
        return {error: "Database error fetching single products by id"};
    }
};
/** Hakee kaikki tuotteet tietokannasta sql kyselyllä
 * @async
 * @returns {Promise<{error: string}|RowDataPacket[][]|RowDataPacket[]|OkPacket|OkPacket[]|ResultSetHeader>}
 * Palauttaa kaikkien tuotteiden tiedot tai errorin jos sql kysely ei onnistunut
 */
const getAll = async () => {
    try {
        const sql = 'SELECT * from product';
        const [rows] = await promisePool.query(sql);
        return rows;
    } catch (e) {
        console.log("Error getting all products: ", e.message);
        return {error: "Database error fetching all products"};
    }
};
/**
 * Antaa module:lle parametriksi tuotteiden eri filtteröinti vaihtoehdot
 * @type {{getFeatured: getFeatured, getAll: getAll, getById: getById, getByCategory: getByCategory}}
 */
module.exports = {
    getFeatured, getByCategory, getById, getAll
};
