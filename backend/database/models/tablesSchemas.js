const Members = `
CREATE TABLE IF NOT EXISTS "Members" (
  "memberName" VARCHAR(255) PRIMARY KEY,
  "password" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const Links = `
CREATE TABLE IF NOT EXISTS "Links" (
    "linkID" VARCHAR(255) PRIMARY KEY,
    "linkURL" VARCHAR(255) NOT NULL,
    "linkTitle" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "hidden" BOOLEAN DEFAULT FALSE
)`;

const Ratings = `
CREATE TABLE IF NOT EXISTS "Ratings" (
    "ratingID" VARCHAR(255) PRIMARY KEY,
    "memberName" VARCHAR(255) NOT NULL,
    "linkID" VARCHAR(255) NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("memberName") REFERENCES "Members" ("memberName"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
)`;

const CoffeePoints = `
CREATE TABLE IF NOT EXISTS "CoffeePoints" (
    "memberName" VARCHAR(255) PRIMARY KEY,
    "points" INTEGER,
    FOREIGN KEY ("memberName") REFERENCES "Members" ("memberName")
)`;


const Favorites = `
CREATE TABLE IF NOT EXISTS "Favorites" (
    "favorite_id" VARCHAR(255) PRIMARY KEY,
    "memberName" VARCHAR(255) NOT NULL,
    "linkID" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("memberName") REFERENCES "Members" ("memberName"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
);`;


module.exports = { Members, Links, Ratings, CoffeePoints, Favorites }