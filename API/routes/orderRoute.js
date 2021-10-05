'use strict';

const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const orderController = require('../controller/orderController');

router.post('/submit',
    [],
    orderController.order_post
);

module.exports = router;
