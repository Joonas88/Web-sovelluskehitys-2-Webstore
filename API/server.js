'use strict';
/** tietokanta yhteyteen tarvittavat construktorit ja funktiot
 * @const
 * @type {e | (() => Express)}
 */
const express = require('express');
/**
 * @constant
 * @type {*|middlewareWrapper}
 */
const cors = require('cors');


/**
 * @constant
 * @type {Router}
 */
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
/**
 * @constant
 * @type {bodyParser | ((options?: (bodyParser.OptionsJson & bodyParser.OptionsText & bodyParser.OptionsUrlencoded)) => createServer.NextHandleFunction)}
 */

const bodyParser = require('body-parser');
const passport = require('./utils/pass.js');
const authRoute = require('./routes/authenticationRoute')
const orderRoute = require('./routes/orderRoute');

/**
 * @constant
 * @type {*|Express}
 */
const app = express();

app.use(cors());

/** expressille annetaan bodyparser käyttöön
 * jolla muutetaan url-osoite encodatuksi ja muutetaan tiedot json muotoon
 *
 */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/auth', authRoute);
app.use('/order', orderRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
app.use("/", productRouter);


/**
 * @constant
 * @type {http.Server}
 * @listens port 8081
 */

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
