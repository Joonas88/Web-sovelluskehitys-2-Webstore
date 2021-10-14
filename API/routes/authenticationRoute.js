'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controller/authenticationController');

router.post('/login', [], authController.login);

router.get('/logout', [], authController.logout);

router.post('/register',
    [
        body('username', 'Username has to have a minimum of 3 characters').isLength({min: 3}),
        body('email', 'Email is not valid').isEmail(),
        body('password', 'A password has to contain at least one uppercase character, and be 8 characters in length.').matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post
);
/**
 * React projektiin lisätty tokenin autentikointi
 */
router.get('/auth',[], authController.authHeader)

module.exports = router;
