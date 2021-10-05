'use strict';

/** Hakee productModelin kansiostaan
 * @constant
 * @type {{getFeatured: getFeatured, getAll: getAll, getById: getById, getByCategory: getByCategory}}
 */
const productModel = require('../model/productModel');

/** Hakee sql kyselyllä featured tuotteet tietokannasta
 * @async
 * @param req sql-kysely
 * @param res sql-vastaus
 * @returns {Promise<void>} Palauttaa etusivun featured tuotteet tietokannasta json muodossa
 */
const getFeaturedProducts = async (req, res) => {
    const products = await productModel.getFeatured();
    res.json(products);
};

/** Hakee sql kyselyllä tietokannasta tuotteet kategorian perusteella
 * @async
 * @param req sql-kysely
 * @param res sql-vastaus
 * @returns {Promise<void>} Palauttaa haetut tietyn kategorian tuotteet tietokannasta json muodossa
 */
const getProductsByCategory = async (req, res) => {
    const category = req.params.category_name.toUpperCase();
    const products = await productModel.getByCategory(category);
    res.json(products);
};

/** Hakee sql kyselyllä tietokannasta tuotteet id:n perusteella
 * @async
 * @param req sql-kysely
 * @param res sql-vastaus
 * @returns {Promise<void>} Palauttaa Id:n perusteella tuotteen tietokannasta json muodossa
 */
const getProductsById = async (req, res) => {
    const products = await productModel.getById(req.params.id);
    res.json(products);
};

/** Hakee sql-kyselyllä kaikki tuotteet tietokannasta
 * @async
 * @param req sql-kysely
 * @param res sql-vastaus
 * @returns {Promise<void>} Palauttaa kaikki tuotteet tietokannasta json muodossa
 */
const getAllProducts = async (req, res) => {
    const products = await productModel.getAll();
    res.json(products);
};

/** Module saa parametrikseen tuotteiden tietokanta kyselyt
 * @type {{getAllProducts: getAllProducts, getProductsById: getProductsById, getFeaturedProducts: getFeaturedProducts, getProductsByCategory: getProductsByCategory}}
 */
module.exports = {
    getFeaturedProducts, getProductsById, getProductsByCategory, getAllProducts
};
