const Database = require('../db');

const isMembersExist = async (memberName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT * FROM "Members" WHERE "memberName" = $1`;
        const values = [memberName];
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

const isLinkExistLinksTable = async (linkID) => {
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

const isLinkExistFavoritesTable = async (linkID) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT "linkID" FROM "Favorites" WHERE "linkID" = $1`;
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

module.exports = { isLinkExistFavoritesTable, isLinkExistLinksTable, isMembersExist };