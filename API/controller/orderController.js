'use strict';

const orderModel = require('../model/orderModel');
const {validationResult} = require('express-validator');

/**
 * React projektiin muokattu palautusarvoja vastaamaan todellista tietokannan palautusarvoa
 * Palauttaa status(200), vain jos uusi rivi on luotu
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const order_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Error while creating a new order: ', errors);
        res.status(400).send(errors.array());
    } else {
        //TJatkokehityksessä lisätään kaikki käyttäjän syöttämät tiedot tietokantaan
        const params = [
            req.body.name,
            req.body.price,
            req.body.email,
            req.body.order,
        ];
        const response = await orderModel.postOrder(params)

        if (response.affectedRows===1) {
            res.status(200).json({msg: "Successfully created a new order"});
        } else {
            res.status(400).json({error: 'Order creation error'});
        }
    }
};

module.exports = {
    order_post
}
