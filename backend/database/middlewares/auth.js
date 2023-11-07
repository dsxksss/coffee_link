const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied! Missing request header token");

    //verify函数会解析传入的token是否合法,如果不合法会抛出一个异常,合法的话返回token里的内容
    try {
        jwt.verify(token, config.get("jwtKey"));
        if (!user) {
           return res.status(404).send("This user does not exist in the database");
        }
        
        return next(); //必须要有next()函数结尾，不然服务会被阻塞到这里
    } catch (error) {
        return res.status(400).send("Unverified token!!");
    }
};