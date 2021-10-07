'use strict';
/**
 * Vaatii tietokannan
 * @type {Pool}
 */
const pool = require('../database/db');
const promisePool = pool.promise();

/** Lisää käyttäjätunnuksen tiedot tietokantaan
 * @async
 * @method lisää tietokantaan luodun käyttäjätilin tiedot
 * @param params Nimi, sähköposti ja salasana
 * @returns {Promise<{error: string}|any>}
 * Palauttaa käyttäjätilin luomisen onnistumisesta tai Errorin käyttäjätunnuksen luomisen epäonnistumisesta
 */
const createUser = async (params) => {
    const user = params.username
    const email = params.userEmail
    const password = params.password
    try {
        const sql = 'INSERT INTO users (Name, Email, Password) VALUES (?, ?, ?)';
        const [rows] = await promisePool.execute(sql, [user, email, password]);
        return rows;
    } catch (error) {
        console.log("Error creating user: + ", error.message);
        return {error: "Error creating user in userModel", id: 1};
    }
};

//TODO uuden funktion kommentointi sekä palautusarvojen täsemnnys
const checkUser = async (params) =>{
    try {
        const sqlQuery='SELECT * FROM users WHERE Name = ? OR Email = ?';
        const [rows] = await promisePool.execute(sqlQuery, params)
        if (rows.length===0) {
            return rows.length
        } else {
            return rows.length
        }
    } catch (error) {
        console.log(error.message)
        return ("error")
    }
}

/** Hakee tietokannasta tiedot käyttäjän sähköpostin perusteella
 * @async
 * @param params sähköpostiosoite
 * @returns {Promise<{error: string}|any>} Palauttaa tiedon käyttäjätilin löytymisestä tietokannasta tai errorin
 * @method Hakee käyttäjätilin tiedon tietokannasta sähköpostin perusteella
 *
 */
const UserLogin = async (params) => {
    try {
        const sql = 'SELECT * FROM users WHERE Email = ?';
        const [rows] = await promisePool.execute(sql, params);
        return rows;
    } catch (e) {
        console.log('Error getting user login', e.message);
        return {error: "Error getting user login in userModel"};
    }
};

/** Hakee käyttäjän tiedot tietokannasta käyttäjän idn perusteella
 * @async
 * @param id käyttäjän id
 * @returns {Promise<{error: string}|any>}
 * Palauttaa käyttäjätilin tiedot käyttäjän id:n perusteella
 */
const findUser = async (id) => {
    try {
        const sql = 'SELECT User_id, Name, Email from users WHERE User_id = ?'
        const [rows] = await promisePool.execute(sql, [id]);
        return rows;
    } catch (error) {
        console.log('Error finding user', error.message);
        return {error: "Error finding user in userModel"};
    }
};

/**
 * Antaa module:lle parametriksi käyttäjään liittyvät tietokanta kyselyt
 * @type {{findUser: findUser, createUser: createUser, UserLogin: UserLogin}}
 */
module.exports = {
    createUser, UserLogin, findUser, checkUser
};
