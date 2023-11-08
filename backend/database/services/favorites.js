const Database = require('../db');
const { v4: uuidv4 } = require('uuid');


const isLinkExist = async (linkID) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT "linkID" FROM "Links" WHERE "linkID" = $1`;
        const values = [linkID];
        const result = await client.query(text, values);
        if (result.rowCount <= 0) {
            return false;
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const addFavorite = async (linkID, memberName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isLinkExist(linkID);

        if (!exist) {
            throw new Error("Link does not exist!");
        }

        const text = `INSERT INTO "Favorites" VALUES ($1,$2,$3)`;
        const favoriteID = uuidv4();
        const values = [favoriteID, linkID, memberName];
        await client.query(text, values);
        const result = await client.query(`SELECT * FROM "Favorites" WHERE "favoriteID" = $1`, [favoriteID]);
        return { ...result.rows[0] };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { addFavorite };