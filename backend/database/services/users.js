const { v4: uuidv4 } = require('uuid');
const { escapedIdentifier} = require("pg")
const { dbInstance } = require('../db')

const registerUser = async (username, password, email) => {
    const client = await dbInstance.connect();
    try {
        const text = `insert into ${escapedIdentifier("Users")} values ($1,$2,$3,$4,$5)`;
        const createdAt = Math.round(new Date() / 1000);
        const values = [uuidv4(), username, password, email, createdAt]
        console.log(values);
        await client.query(text, values);
    } catch (error) {
        throw new Error(`Couldn't registerUser:${error}`)
    }
}

module.exports = { registerUser }