const users = `
CREATE TABLE IF NOT EXISTS Users (
  UserID SERIAL PRIMARY KEY,
  Username VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP NOT NULL
)`;

const links = `
CREATE TABLE IF NOT EXISTS Links (
    LinkID SERIAL PRIMARY KEY,
    LinkURL VARCHAR(255) NOT NULL,
    LinkTitle VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Hidden BOOLEAN DEFAULT FALSE
)`;

const ratings = `
CREATE TABLE IF NOT EXISTS Ratings (
    RatingID SERIAL PRIMARY KEY,
    UserID INTEGER NOT NULL,
    LinkID INTEGER NOT NULL,
    RatingScore INTEGER NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users (UserID),
    FOREIGN KEY (LinkID) REFERENCES Links (LinkID)
)`;

const coffeePoints = `
CREATE TABLE IF NOT EXISTS CoffeePoints (
    UserID INTEGER PRIMARY KEY,
    Points INTEGER,
    FOREIGN KEY (UserID) REFERENCES Users (UserID)
)`;


module.exports = { users, links, ratings, coffeePoints }