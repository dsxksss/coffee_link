const bcrypt = require('bcrypt');
const Database = require('../db');
const config = require('config');

const registerMember = async (memberName, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `INSERT INTO "Members" VALUES ($1,$2,DEFAULT)`;
        const passwordSalt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(`${password}-${config.get("bcryptKey")}`, passwordSalt);
        const values = [memberName, hashedPassword];
        await client.query(text, values);
    } catch (error) {
        throw new Error(error.message)
    } finally {
        client.release();
    }
}

const validateMember = async (memberName, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT * FROM "Members" WHERE "memberName" = $1`;
        const values = [memberName];
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
                memberName: result.rows[0].memberName,
                createdAt: result.rows[0].createdAt
            } : undefined
        ];
    } catch (error) {
        throw new Error(error.message)
    } finally {
        client.release();
    }
}

module.exports = { registerMember,  validateMember }