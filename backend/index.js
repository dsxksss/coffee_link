const express = require('express');
const config = require('config');
const chalk = require('chalk');
const multer = require('multer');
const checkCofing = require("./utils/chckeConfig")
const morgan = require('morgan');
const figlet = require('figlet');
const fs = require('fs')
const path = require('path');
const app = express();
const { registerControllers } = require('./registerControllers')
const Database = require('./database/db')

figlet(`Coffee  Links`,async function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(chalk.yellow(data));
    checkCofing();
    await Database.getInstance().connectToDatabase();
    const logStream = fs.createWriteStream(path.join(__dirname, "coffee_links_backend.log"), {
        flags: "a",
    });
    app.use(morgan("combined", { stream: logStream }));
    app.use(multer().any());

    registerControllers(app);

    const serverConfigHost = config.get('serverConfig.host')
    const serverConfigPort = config.get('serverConfig.port');
    app.listen(serverConfigPort,serverConfigHost, () => {
        console.log("CoffeeLinks backend server is running on",chalk.green(`${chalk.blueBright(`${serverConfigHost}:${serverConfigPort}`)}`));
    });
});


