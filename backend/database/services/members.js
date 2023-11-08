const bcrypt = require('bcrypt');
const Database = require('../db');
const config = require('config');
const { encryptionData, compareBcryptData } = require('../../utils/bcryptData')

const registerMember = async (memberName, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `INSERT INTO "Members" VALUES ($1,$2,DEFAULT)`;
        const hashedPassword = encryptionData(password);
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
        const validate = compareBcryptData(password, result.rows[0].password);

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

const updateMember = async (memberName, password, newMbmberName, newPassword) => {
    const client = await Database.getInstance().pool.connect();
    try {
        await validateMember(memberName, password);
        const [validate, _] = await validateMember(memberName, password);

        if (!validate) {
            throw new Error("Validate failed!");
        }

        const text = `UPDATE "Members" SET "memberName" = $1, "password" = $2 WHERE "memberName" = $3`;
        const hashedPassword = encryptionData(newPassword);
        const values = [newMbmberName, hashedPassword, memberName]; 
        await client.query(text, values);
    } catch (error) {
        throw new Error(error.message)
    } finally {
        client.release();
    }
}

module.exports = { registerMember, validateMember, updateMember }