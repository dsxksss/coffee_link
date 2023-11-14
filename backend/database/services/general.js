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

const incrementalCoffeePoints = async (memberName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isMembersExist(memberName);
        if (!exist) {
            throw new Error("Member does not exist");
        }

        const text = `UPDATE "Members" SET "points" = "points" + $1 WHERE "points" < $2`;
        const values = [20,100000];
        await client.query(text, values);
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const decrementCoffeePoints = async (memberName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isMembersExist(memberName);
        if (!exist) {
            throw new Error("Member does not exist");
        }

        const text = `UPDATE "Members" SET "points" = "points" - $1 WHERE "points" > $2`;
        const values = [5,0];
        await client.query(text, values);
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { isLinkExistFavoritesTable, isLinkExistLinksTable, isMembersExist, decrementCoffeePoints, incrementalCoffeePoints };