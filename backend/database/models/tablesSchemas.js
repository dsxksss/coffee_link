const Members = `
CREATE TABLE IF NOT EXISTS "Members" (
  "memberName" VARCHAR(255) PRIMARY KEY,
  "password" VARCHAR(255) NOT NULL,
  "points" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const Links = `
CREATE TABLE IF NOT EXISTS "Links" (
    "linkID" VARCHAR(255) PRIMARY KEY,
    "linkURL" VARCHAR(255) NOT NULL,
    "linkTitle" VARCHAR(255) NOT NULL,
    "linkDescription" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(255) NOT NULL,
    "hidden" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("creator") REFERENCES "Members" ("memberName")
)`;

const Ratings = `
CREATE TABLE IF NOT EXISTS "Ratings" (
    "ratingID" VARCHAR(255) PRIMARY KEY,
    "rater" VARCHAR(255) NOT NULL,
    "linkID" VARCHAR(255) NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("rater") REFERENCES "Members" ("memberName"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
)`;

const Favorites = `
CREATE TABLE IF NOT EXISTS "Favorites" (
    "linkID" VARCHAR(255) PRIMARY KEY,
    "collector" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("collector") REFERENCES "Members" ("memberName"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
);`;


module.exports = { Members, Links, Ratings, Favorites }