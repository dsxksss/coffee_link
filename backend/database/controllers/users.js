const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { registerUser } = require('../services/users')

router.post('/', async (req, res) => {
    const validateSchema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        email: Joi.string().email()
    })
    try {
        const { username, password, email } = await validateSchema.validateAsync(req.body);
        await registerUser(username, password, email);
        res.status(200).send("Created user successfully");
    } catch (error) {
        res.status(400).send(`Create user failed :${error.message}`)
    }
});

router.post('/:id', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    res.json(user);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
});

router.get('/', async (req, res) => {
    const { page, limit } = req.query;
    const users = await userService.getUsers(page, limit);
    res.json(users);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const user = await userService.updateUser(id, updates);
    res.json(user);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.sendStatus(204);
});



module.exports = router;