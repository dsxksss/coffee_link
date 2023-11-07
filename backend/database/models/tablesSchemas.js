const users = `
CREATE TABLE IF NOT EXISTS "Users" (
  "userID" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL
)`;

const links = `
CREATE TABLE IF NOT EXISTS "Links" (
    "linkID" SERIAL PRIMARY KEY,
    "linkURL" VARCHAR(255) NOT NULL,
    "linkTitle" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "hidden" BOOLEAN DEFAULT FALSE
)`;

const ratings = `
CREATE TABLE IF NOT EXISTS "Ratings" (
    "ratingID" SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL,
    "linkID" INTEGER NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userID") REFERENCES "Users" ("userID"),
    FOREIGN KEY ("linkID") REFERENCES "Links" ("linkID")
)`;

const coffeePoints = `
CREATE TABLE IF NOT EXISTS "CoffeePoints" (
    "userID" INTEGER PRIMARY KEY,
    "points" INTEGER,
    FOREIGN KEY ("userID") REFERENCES "Users" ("userID")
)`;


module.exports = { users, links, ratings, coffeePoints }