const express = require('express');
const config = require('config');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const checkCofing = require("./functions/chckeConfig")
const morgan = require('morgan');
const figlet = require('figlet');
const fs = require('fs')
const path = require('path');
const app = express();
const { registerControllers } = require('./registerControllers')
const { connectToDatabase } = require('./database/db')

figlet(`Coffee  Links`, function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(chalk.yellow(data));
    checkCofing();
    connectToDatabase();
    const logStream = fs.createWriteStream(path.join(__dirname, "coffee_link_backend.log"), {
        flags: "a",
    });
    app.use(morgan("combined", { stream: logStream }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    registerControllers(app);

    const serverConfigHost = config.get('serverConfig.host')
    const serverConfigPort = config.get('serverConfig.port');
    app.listen(serverConfigPort,serverConfigHost, () => {
        console.log("CoffeeLinks backend server is running on",chalk.green(`${chalk.bgRedBright(`${serverConfigHost}:${serverConfigPort}`)}`));
    });
});


