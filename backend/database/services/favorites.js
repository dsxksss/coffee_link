const Database = require('../db');
const { v4: uuidv4 } = require('uuid');
const { isLinkExistFavoritesTable, isLinkExistLinksTable } = require('./general')

const getFavorites = async (collector) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `
        SELECT "Links".*,"Favorites".*,"Members".points FROM "Links" INNER
        JOIN "Favorites" ON "Links"."linkID" = "Favorites"."linkID"
        JOIN "Members" ON "Links"."creator" = "Members"."memberName"
        WHERE EXISTS (SELECT * FROM "Favorites" WHERE "collector" = $1)`;
        const values = [collector];
        const result = await client.query(text, values);

        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const verifyCollector = async (linkID, collector) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isLinkExistLinksTable(linkID);

        if (!exist) {
            throw new Error("Link does not exist!");
        }

        const text = `SELECT * FROM "Favorites" WHERE "linkID" = $1 AND "collector" = $2;`;

        const values = [linkID, collector];
        const result = await client.query(text, values);

        if (result.rowCount > 0) {
            return false;
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const addFavorite = async (linkID, collector) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const verify = await verifyCollector(linkID, collector);

        if (!verify) {
            throw new Error("This link is already in favorites");
        }

        const text = `INSERT INTO "Favorites" VALUES ($1,$2, $3);`;
        const values = [uuidv4(), linkID, collector];
        await client.query(text, values);
        
        const result = await getFavorites(collector);
        return result;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const deleteFavorite = async (linkID, collector) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isLinkExistFavoritesTable(linkID);

        if (!exist) {
            throw new Error("Link does not exist!");
        }

        const text = `DELETE FROM "Favorites" WHERE "linkID" = $1`;
        const values = [linkID];
        await client.query(text, values);

        const result = await getFavorites(collector);
        return result;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { addFavorite, getFavorites, deleteFavorite };