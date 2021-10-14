'use strict';

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const orderController = require('../controller/orderController');

/**
 * lisätty sähköpostin validointi react projektiin
 */
router.post('/submit',
    [        body('email', 'Email is not valid').isEmail(),
    ],
    orderController.order_post
);

module.exports = router;
