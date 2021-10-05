'use strict';

const userModel = require('../model/userModel');

const user_get = async (req, res) => {
    const User_id = req.params.id;
    const user = await userModel.findUser(User_id);
    res.json(user);
};

module.exports = {
    user_get
};
