const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { linkRating, getMemberRating } = require('../services/ratings');
const auth = require('../middlewares/auth');

// Get member rating
router.get('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
    });
    try {
        const { linkID } = await validateSchema.validateAsync(req.body);
        const data = await getMemberRating(linkID, req.tokenData.memberName);
        res.send({ data, msg: "Get member rating successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Get member rating failed! ${error}` })
    }
})

// Link rating
router.post('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
        ratingScore: Joi.number().min(1).max(5).integer().required(),
    });
    try {
        const { linkID, ratingScore } = await validateSchema.validateAsync(req.body);
        const data = await linkRating(linkID, req.tokenData.memberName, ratingScore);
        res.send({ data, msg: "Link rating successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Link rating failed! ${error}` })
    }
})


module.exports = router;