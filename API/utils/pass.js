'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../model/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');
const secrets = require("../config/secrets");

/** Luo kirjautumisen käyttäjä ja salasanan vaatien jonka lisäksi tarkastaa että syötetyt tiedot kelpaavat
 * @async
 * @constructor Strategy
 * @param {string} username
 * @param {string} password
 * @return virheilmoitus puuttuvasta tiedosta tai ilmoitus onnistumisesta
 */
passport.use(new Strategy(
    async (username, password, done) => {
        const params = [username];
        try {
            const [user] = await userModel.UserLogin(params);
            if (user === undefined) {
                return done(null, false, {message: 'Incorrect email'});
            }
            if (!bcrypt.compareSync(password, user.Password)) {
                return done(null, false, {message: 'Incorrect password'});
            }
            return done(null, {...user}, {message: 'Logged In Successfully'});
        } catch (err) {
            return done(err);
        }
    }));
//TODO Jos ei enää kirjautuminen toimi vaihda rivillä 37 secretOrKey: 'ryhma3'
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secrets.jwtSecret,
    },
    async (jwtPayload, done) => {
        try {
            const [user] = await userModel.findUser(jwtPayload.User_id);

            console.log('jwt', jwtPayload);
            if (user === undefined) {
                return done(null, false);
            }
            const plainUser = {...user};
            return done(null, plainUser);

        } catch (err) {
            return done(err);
        }
    },
));

module.exports = passport;
