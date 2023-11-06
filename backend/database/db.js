const { Pool } = require('pg');
const config = require('config');
const tablesSchemas = require('./models/tablesSchemas');
const chalk = require('chalk');

const dbInstance = new Pool({
    database: 'postgres', // the default database name
    user: config.get("pgConnectConfig.user"),
    password: config.get("pgConnectConfig.password"),
    host: config.get("pgConnectConfig.host"),
    port: config.get("pgConnectConfig.port"),
    max: config.get("pgConnectConfig.maxConnections"),
    idleTimeoutMillis: config.get("pgConnectConfig.idleTimeoutMillis"),
    connectionTimeoutMillis: config.get("pgConnectConfig.connectionTimeoutMillis"),
});

// Check if the database exists
async function checkDatabaseExists() {
    const client = await dbInstance.connect();
    try {
        const result = await client.query("SELECT datname FROM pg_database WHERE datname = $1", [
            // Because when PostgreSQL creates a database, the database name is all lowercase.
            config.get("pgConnectConfig.database").toLowerCase()
        ]);
        return result.rowCount > 0;
    } catch (error) {
        throw new Error(`Error checking if database exists: ${error}`)
    } finally {
        client.release();
    }
}

// Create a new database
async function createDatabase() {
    const client = await dbInstance.connect();
    try {
        // 创建数据库
        await client.query(`CREATE DATABASE ${config.get("pgConnectConfig.database")}`);
    } catch (error) {
        throw new Error(`Error createDatabase failed: ${error}`)
    } finally {
        client.release();
    }
}

async function syncTables() {
    const client = await dbInstance.connect();
    try {
        for (let [tableName, tablesSchemaSql] of Object.entries(tablesSchemas)) {
            await client.query(tablesSchemaSql);
            console.log(`Table [${chalk.green(tableName)}] created successfully`);
        }
    } catch (error) {
        throw new Error(`Error syncTables failed: ${error}`)
    } finally {
        client.release();
    }
}

// Connect to the database
async function connectToDatabase() {
    try {
        const databaseExists = await checkDatabaseExists();
        if (!databaseExists) {
            await createDatabase();
        }

        // Update the database name of the connection configuration
        dbInstance.options.database = config.get("pgConnectConfig.database");

        // synchronized tables
        await syncTables();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = { dbInstance, connectToDatabase };