const Database = require('../db');
const { v4: uuidv4 } = require('uuid');
const { isLinkExistLinksTable, incrementalCoffeePoints, decrementCoffeePoints } = require('./general');

const verifyRater = async (linkID, rater) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const exist = await isLinkExistLinksTable(linkID);

        if (!exist) {
            throw new Error("Link does not exist!");
        }

        const text = `SELECT "linkID","rater" FROM "Ratings" WHERE "linkID" = $1 AND "rater" = $2`;
        const values = [linkID, rater];
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

const getMemberRating = async (linkID, rater) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `SELECT * FROM "Ratings" WHERE "linkID" = $1 AND "rater" = $2`;
        const values = [linkID, rater];
        const result = await client.query(text, values);

        if (result.rowCount <= 0) {
            throw new Error("Member rating not exist!");
        }

        return result.rows[0];
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const linkRating = async (linkID, rater, ratingScore) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const verify = await verifyRater(linkID, rater);

        if (!verify) {
            throw new Error("Links can only be rated once!");
        }

        const text = `INSERT INTO "Ratings" VALUES ($1,$2,$3,$4,DEFAULT)`;
        const ratingID = uuidv4();
        const values = [ratingID, rater, linkID, ratingScore];
        await client.query(text, values);
        
        if (ratingScore >= 3) {
            await incrementalCoffeePoints(rater);
        } else {
            await decrementCoffeePoints(rater);
        }

    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { linkRating, getMemberRating };