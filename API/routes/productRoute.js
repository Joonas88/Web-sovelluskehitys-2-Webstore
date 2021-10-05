'use strict';
/** Vaaditaan express käyttö
 * @constant
 * @type {e | (() => Express)}
 */
const express = require('express');

/**
 * @constant
 * @type {Router}
 */
const router = express.Router();

/**
 * Annetaan kontrolleri käyttöön
 * @type {{getAllProducts: function(*, *): Promise<void>, getProductsById: function(*, *): Promise<void>, getFeaturedProducts: function(*, *): Promise<void>, getProductsByCategory: function(*, *): Promise<void>}}
 */
const productController = require('../controller/productController');

/**
 * Asetetaan Vue:n routerin osoitteet
 */
router.get('/components/:category_name', productController.getProductsByCategory);

router.get('/products', productController.getAllProducts);

router.get('/products/:id', productController.getProductsById);

router.get('/featured', productController.getFeaturedProducts);

module.exports = router;