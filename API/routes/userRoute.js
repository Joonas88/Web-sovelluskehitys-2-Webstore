'use strict';
/**
 * Vaaditaan expressin käyttö
 * @type {e|(() => Express)}
 */
const express = require('express');
/**
 * Express router käyttöön
 * @type {Router}
 */
const router = express.Router();
const userController = require('../controller/userController');

router.get('/:id', userController.user_get);

module.exports = router;