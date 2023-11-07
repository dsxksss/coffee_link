const Users = `
CREATE TABLE IF NOT EXISTS "Users" (
  "username" VARCHAR(255) PRIMARY KEY,
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
    "username" VARCHAR(255) NOT NULL,
    "linkID" VARCHAR(255) NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("username") REFERENCES "Users" ("username"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
)`;

const CoffeePoints = `
CREATE TABLE IF NOT EXISTS "CoffeePoints" (
    "username" VARCHAR(255) PRIMARY KEY,
    "points" INTEGER,
    FOREIGN KEY ("username") REFERENCES "Users" ("username")
)`;


module.exports = { Users, Links, Ratings, CoffeePoints }