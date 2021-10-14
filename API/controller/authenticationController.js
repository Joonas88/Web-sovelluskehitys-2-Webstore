'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const secrets = require("../config/secrets");

/**
 * Lisätty tokenin vanhenemisaika React projekitn toteutukseen
 * @param req pyyntö palvelimelle
 * @param res palauttaa palvelimelta saadun datan
 */
const login = (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
        console.log('log in', info);
        if (error || !user) {
            return res.status(400).json({
                message: 'Error authenticating during login',
                user: user,
            });
        }
        const token = jwt.sign(user, secrets.jwtSecret, {expiresIn: "1h"});
        return res.json({user, token});
    })(req, res);
};

/**
 * Lisätty rekisteröitävän käyttäjän tietojen tarkistuksen kutsu userMode.chekcUser sekä vertailuoperaattorit
 * Tällä varmistetaan ettei voi rekisteröidä samaa käyttäjätunnusta tai salasanaa
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const user_create_post = async (req, res) => {
    const errors = validationResult(req);

    const params = [
        req.body.username,
        req.body.email
    ]

    const check = await userModel.checkUser(params)

    if(check===0){
        if (!errors.isEmpty()) {
            console.log('Error while creating a new user: ', errors);
            res.send(errors.array());
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const params = {
                username:req.body.username,
                userEmail:req.body.email,
                password:hash
            };

            if (await userModel.createUser(params)) {
                res.status(200).json({msg: "Successfully created a new user"});
            } else {
                res.status(400).json({error: 'User creation error'});
            }
        }
    } else {
        res.status(400).json({error: 'Something went wrong'})
    }
};

const logout = (req, res) => {
    res.json({message: 'User logged out'});
};

/**
 * Lisätty React toteutukseen token autentikointi serverin kautta.
 * Funktio tarkistaa tokenin voimassaolon ja palauttaa sitä vastaavan arvon
 * @param req pyyntö palvelimelle joka sisältää tokenin
 * @param res palauttaa käyttäjänimen, jos autentkointi on tosi
 */
const  authHeader = (req, res) => {
    const authHeader=req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, secrets.jwtSecret, (err, user) => {
        if(err){
            console.log(err)
            res.send("Error")
        } else {
            res.status(200).send(JSON.stringify(user.Name))
        }
    })


}

module.exports = {
    login,
    user_create_post,
    logout,
    authHeader
};
