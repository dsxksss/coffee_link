const Database = require('../db');
const { v4: uuidv4 } = require('uuid');

const getRatingStats = async () => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `
        SELECT "Ratings"."linkID",
        ROUND(AVG("ratingScore"),1) AS "averageRatingScore",
        COUNT("ratingScore") AS "totalMembersOfRating",
        ROUND(AVG("ratingScore"),1) AS "globalAverageRating", 
        COUNT("rater") AS "totalRatingMembers" FROM "Ratings"
        GROUP BY "Ratings"."linkID";`;

        const result = await client.query(text);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

const getAllLinks = async () => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `
        SELECT "Links".*, "Members"."points" FROM "Links"
        INNER JOIN "Members" ON "Links"."creator" = "Members"."memberName"
        WHERE "hidden" = false
        GROUP BY "Links"."linkID", "Members"."points"
        ORDER BY "Links"."createdAt" DESC;`;

        const result = await client.query(text);

        const ratingStats = await getRatingStats();

        const newResult = [];
        for (row of result.rows) {
            const ratingStat = ratingStats.find(stat => stat.linkID === row.linkID);
            if (ratingStat) {
                newResult.push(
                    {
                        ...row,
                        averageRatingScore: ratingStat.averageRatingScore,
                        totalMembersOfRating: ratingStat.totalMembersOfRating,
                        globalAverageRating: ratingStat.globalAverageRating,
                        totalRatingMembers: ratingStat.totalRatingMembers,
                    }
                )
                continue;
            } else {
                newResult.push(
                    {
                        ...row,
                        averageRatingScore: 0,
                        totalMembersOfRating: 0,
                        globalAverageRating: 0,
                        totalRatingMembers: 0,
                    }
                )
            }
        }

        return newResult;
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

const getMemberHiddenLinks = async (creatorName) => {
    const client = await Database.getInstance().pool.connect();
    try {
        const text = `
        SELECT "Links".*, "Members"."points" FROM "Links"
        INNER JOIN "Members" ON "Links"."creator" = "Members"."memberName"
        WHERE "Links"."creator" = $1 AND "hidden" = true
        GROUP BY "Links"."linkID", "Members"."points"
        ORDER BY "Links"."createdAt" DESC;`;

        const result = await client.query(text, [creatorName]);

        const ratingStats = await getRatingStats();

        const newResult = [];
        for (row of result.rows) {
            const ratingStat = ratingStats.find(stat => stat.linkID === row.linkID);
            if (ratingStat) {
                newResult.push(
                    {
                        ...row,
                        averageRatingScore: ratingStat.averageRatingScore,
                        totalMembersOfRating: ratingStat.totalMembersOfRating,
                        globalAverageRating: ratingStat.globalAverageRating,
                        totalRatingMembers: ratingStat.totalRatingMembers,
                    }
                )
                continue;
            } else {
                newResult.push(
                    {
                        ...row,
                        averageRatingScore: 0,
                        totalMembersOfRating: 0,
                        globalAverageRating: 0,
                        totalRatingMembers: 0,
                    }
                )
            }
        }

        return newResult;
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

        if (!verify) {
            throw new Error("Insufficient permissions");
        }

        const deleteFavoritesQuery = `DELETE FROM "Favorites" WHERE "linkID" = $1`;
        const deleteFavoritesValues = [linkID];
        await client.query(deleteFavoritesQuery, deleteFavoritesValues);

        const deleteRatingsQuery = `DELETE FROM "Ratings" WHERE "linkID" = $1`;
        const deleteRatingsValues = [linkID];
        await client.query(deleteRatingsQuery, deleteRatingsValues);

        const deleteLinksQuery = `DELETE FROM "Links" WHERE "linkID" = $1`;
        const deleteLinksValues = [linkID];
        await client.query(deleteLinksQuery, deleteLinksValues);

    } catch (error) {
        throw new Error(error.message);
    } finally {
        client.release();
    }
}

module.exports = { getAllLinks, createLink, verifyCreator, updateLink, deleteLink, getMemberLinksAndAllLinks: getMemberHiddenLinks };