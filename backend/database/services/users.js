const bcrypt = require('bcrypt');
const Database = require('../db');
const config = require('config');

const registerUser = async (username, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `INSERT INTO "Users" VALUES ($1,$2,DEFAULT)`;
        const passwordSalt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(`${password}-${config.get("bcryptKey")}`, passwordSalt);
        const values = [username, hashedPassword];
        await client.query(text, values);
    } catch (error) {
        throw new Error(error.message)
    } finally {
        client.release();
    }
}

const validateUser = async (username, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT * FROM "Users" WHERE username = $1`;
        const values = [username];
        const result = await client.query(text, values);
        
        if (result.rowCount <= 0) {
            return [false, undefined];
        }

        const validate = bcrypt.compareSync(`${password}-${config.get("bcryptKey")}`, result.rows[0].password);


        // Return tow parameters validate,and validateData
        return [
            validate,
            // If validate not true, them return an undefined value
            result.rows ? {
                username: result.rows[0].username,
                createdAt: result.rows[0].createdAt
            } : undefined
        ];
    } catch (error) {
        throw new Error(error.message)
    } finally {
        client.release();
    }
}

module.exports = { registerUser, validateUser }