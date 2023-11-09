const Database = require('../db');

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

const getFavorites = async (collector)=>{
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

const addFavorite = async (linkID, collector) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isLinkExistLinksTable(linkID);

        if (!exist) {
            throw new Error("Link does not exist!");
        }

        const text = `INSERT INTO "Favorites" VALUES ($1,$2)`;
        const values = [linkID, collector];
        await client.query(text, values);
        const result = await getFavorites(collector);
        return result;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const deleteFavorite = async (linkID, collector)=>{
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