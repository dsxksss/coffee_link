const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { registerMember, validateMember, updateMember } = require('../services/members')

const baseValidateSchema = Joi.object({
    memberName: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

// Member register 
router.post('/register', async (req, res) => {
    try {
        const { memberName, password } = await baseValidateSchema.validateAsync(req.body);
        await registerMember(memberName, password);
        res.send({ msg: "Register successfully" });
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

// Update member information
router.put('/', async (req, res) => {
    try {
        const validateSchema = Joi.object({
            memberName: Joi.string().min(3).max(30).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            newMemberName: Joi.string().min(3).max(30).required(),
            newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        });
        const { memberName, password, newMemberName, newPassword } = await validateSchema.validateAsync(req.body);
        await updateMember(memberName, password, newMemberName, newPassword);

        res.send({ msg: "Update member data successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Update member data failed ${error}` });
    }
})

module.exports = router;