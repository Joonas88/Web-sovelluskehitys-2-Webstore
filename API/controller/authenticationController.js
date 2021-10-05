'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../model/userModel');

const login = (req, res) => {
    passport.authenticate('local', {session: false}, (error, user, info) => {
        console.log('log in', info);
        if (error || !user) {
            return res.status(400).json({
                message: 'Error authenticating during login',
                user: user,
            });
        }
        req.login(user, {session: false}, (error) => {
            if (error) {
                res.send(error);
            }
            const token = jwt.sign(user, 'ryhma3');
            return res.json({user, token});
        });

    })(req, res);
};

const user_create_post = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('Error while creating a new user: ', errors);
        res.send(errors.array());
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const params = [
            req.body.username,
            req.body.email,
            hash,
        ];

        if (await userModel.createUser(params)) {
            res.status(200).json({msg: "Successfully created a new user"});
        } else {
            res.status(400).json({error: 'User creation error'});
        }
    }
};

const logout = (req, res) => {
    req.logout();
    res.json({message: 'User logged out'});
};

module.exports = {
    login,
    user_create_post,
    logout,
};
