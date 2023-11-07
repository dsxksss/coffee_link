const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { registerMember, validateMember } = require('../services/members')

const baseValidateSchema = Joi.object({
    memberName: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

// Member register 
router.post('/register', async (req, res) => {
    try {
        const {  memberName, password } = await baseValidateSchema.validateAsync(req.body);
        await registerMember(memberName, password);
        res.send({ msg: "Register successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Register failed ${error}` })
    }
});

// Member login
router.post('/', async (req, res) => {
    try {
        const {  memberName, password } = await baseValidateSchema.validateAsync(req.body);
        const [validate, validateData] = await validateMember(memberName, password, true);
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