const Database = require('../db');
const jwt = require("jsonwebtoken");
const config = require('config');
const { isMembersExist } = require('../services/general')
const { encryptionData, compareBcryptData } = require('../../utils/bcryptData')

const registerMember = async (memberName, password) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isMembersExist(memberName);
        if(exist) {
            throw new Error(`Member ${memberName} already exists`);
        }

        const text = `INSERT INTO "Members" VALUES ($1,$2,$3,DEFAULT)`;
        const hashedPassword = encryptionData(password);
        const values = [memberName, hashedPassword, 0];
        await client.query(text, values);
        
        await validateMember(memberName, password);
        const [validate, data] = await validateMember(memberName, password);

        if (!validate) {
            throw new Error("Validate failed!");
        }

        return data;
        
    } catch (error) {
        throw new Error(error.message);
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
        const authToken = jwt.sign({ memberName: result.rows[0].memberName },
            config.get("jwtKey"),
        );

        // Return tow parameters validate,and validateData
        return [
            validate,
            // If validate not true, them return an undefined value
            result.rows ? {
                authToken,
                memberCreatedAt: result.rows[0].createdAt
            } : undefined
        ];
    } catch (error) {
        throw new Error(error.message);
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
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { registerMember, validateMember, updateMember }