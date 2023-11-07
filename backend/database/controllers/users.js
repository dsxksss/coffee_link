const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { registerUser, validateUser } = require('../services/users')

const baseValidateSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

// Register user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = await baseValidateSchema.validateAsync(req.body);
        await registerUser(username, password);
        res.send({ msg: "Register successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Register failed ${error}` })
    }
});

// Login user
router.post('/', async (req, res) => {
    try {
        const { username, password } = await baseValidateSchema.validateAsync(req.body);
        const [validate, validateData] = await validateUser(username, password, true);
        if (validate) {
            res.send({ data: validateData, msg: "Login successfully" });
        } else {
            throw new Error("Validate failed!");
        }
    } catch (error) {
        res.status(400).send({ msg: `Login failed ${error}` });
    }
});

module.exports = router;