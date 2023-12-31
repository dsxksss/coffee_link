const express = require('express');
const Joi = require('joi');
const router = express.Router();
const auth = require('../middlewares/auth');
const { registerMember, validateMember, updateMember, getMemberInfo } = require('../services/members')

const baseValidateSchema = Joi.object({
    memberName: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// Member register 
router.post('/register', async (req, res) => {
    try {
        const { memberName, password } = await baseValidateSchema.validateAsync(req.body);
        const data = await registerMember(memberName, password);
        res.send({ data, msg: "Register successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Register failed ${error}` })
    }
});

// Member login
router.post('/', async (req, res) => {
    try {
        const { memberName, password } = await baseValidateSchema.validateAsync(req.body);
        const [validate, validateData] = await validateMember(memberName, password);
        if (validate) {
            res.send({ data: validateData, msg: "Login successfully" });
        } else {
            throw new Error("Validate failed!");
        }
    } catch (error) {
        res.status(400).send({ msg: `Login failed ${error}` });
    }
});

// Use authToken login
router.post('/tokenLogin', auth, async (req, res) => {
    try {
        const data = await getMemberInfo(req.tokenData.memberName);
        res.send({ data, msg: "Login successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Login failed ${error}` });
    }
})

// Update member information
router.put('/', async (req, res) => {
    try {
        const validateSchema = Joi.object({
            memberName: Joi.string().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            newMemberName: Joi.string().min(3).max(30).required(),
            newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const { memberName, password, newMemberName, newPassword } = await validateSchema.validateAsync(req.body);
        await updateMember(memberName, password, newMemberName, newPassword);

        res.send({ msg: "Update member information successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Update member information failed ${error}` });
    }
})

module.exports = router;