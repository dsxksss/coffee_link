const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { addFavorite, getFavorites, deleteFavorite } = require('../services/favorites');
const auth = require('../middlewares/auth');

// Get member all favorites
router.get('/', auth, async (req, res) => {
    try {
        const data = await getFavorites(req.tokenData.memberName);
        res.send({ data, msg: "Get member all favorites successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Get member all favorites failed! ${error}` })
    }
})

// Add favorite
router.post('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
    });
    try {
        const { linkID } = await validateSchema.validateAsync(req.body);
        const data = await addFavorite(linkID, req.tokenData.memberName);
        res.send({ data, msg: "Add favorite successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Add favorite failed! ${error}` })
    }
})

// Delete favorite
router.delete('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
    });
    try {
        const { linkID } = await validateSchema.validateAsync(req.body);
        const data = await deleteFavorite(linkID,req.tokenData.memberName);
        res.send({ data, msg: "Delete favorite successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Delete favorite failed! ${error}` })
    }
})

module.exports = router;