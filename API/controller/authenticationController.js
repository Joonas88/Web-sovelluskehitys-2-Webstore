'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {validationResult, body} = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');
const secrets = require("../config/secrets");

const login = (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
        console.log('log in', info);
        if (error || !user) {
            return res.status(400).json({
                message: 'Error authenticating during login',
                user: user,
            });
        }
        const token = jwt.sign(user, secrets.jwtSecret, {expiresIn: "60s"});
        return res.json({user, token});

        //TODO Selvitä voiko käyttää reactin kanssa?
        /*
        req.login(user, {session: false}, (error) => {
            if (error) {
                res.send(error);
            }
            const token = jwt.sign(user, secrets.jwtSecret, {expiresIn: "60s"});
            return res.json({user, token});
        });
         */

    })(req, res);
};

const user_create_post = async (req, res) => {
    const errors = validationResult(req);

    const params = [
        req.body.username,
        req.body.email
    ]
    //TODO varmista, että palauttaa oikeaa dataa ja on vakaa
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
//TODO Login ja logout tietojen tallentaminen locaalisti tai sessioon ja tarkistus jwt.auth yms.
const logout = (req, res) => {
    req.logout();
    res.json({message: 'User logged out'});
};

module.exports = {
    login,
    user_create_post,
    logout,
};
