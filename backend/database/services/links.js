const Database = require('../db');
const { v4: uuidv4 } = require('uuid');

const getAllLinks = async () => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT * FROM "Links"`;
        const result = await client.query(text);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
};

const createLink = async (linkURL, linkTitle, linkDescription, creator, hidden) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `INSERT INTO "Links" VALUES ($1,$2,$3,$4,$5,$6,DEFAULT)`;
        const linkID = uuidv4();
        const values = [linkID, linkURL, linkTitle, linkDescription, creator, hidden];
        await client.query(text, values);
        const result = await client.query(`SELECT * FROM "Links" WHERE "linkID" = $1`, [linkID]);
        return { ...result.rows[0] };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const verifyCreator = async (linkID, creatorName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT "linkID","creator" FROM "Links" WHERE "linkID" = $1`;
        const values = [linkID];
        const result = await client.query(text, values);
        if (result.rowCount <= 0 || result.rows[0].creator !== creatorName) {
            return false;
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const updateLink = async (linkID, creatorName, newLinkURL, newLinkTitle, newLinkDescription, newHidden) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const verify = await verifyCreator(linkID, creatorName);
        
        if (!verify) {
            throw new Error("Insufficient permissions");
        }

        const text = `UPDATE "Links" SET "linkURL" = $1, "linkTitle" = $2, "linkDescription" = $3, "hidden" = $4 WHERE "linkID" = $5`;
        const values = [newLinkURL, newLinkTitle, newLinkDescription, newHidden, linkID];
        await client.query(text, values);
        const result = await client.query(`SELECT * FROM "Links" WHERE "linkID" = $1`, [linkID]);
        return { ...result.rows[0] };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const deleteLink = async (linkID, creatorName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const verify = await verifyCreator(linkID, creatorName);

        console.log(verify);
        if (!verify) {
            throw new Error("Insufficient permissions");
        }

        const text = `DELETE FROM "Links" WHERE "linkID" = $1`;
        const values = [linkID];
        await client.query(text, values);

    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { getAllLinks,createLink, verifyCreator, updateLink, deleteLink };