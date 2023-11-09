const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { linkRating } = require('../services/ratings');
const auth = require('../middlewares/auth');

// Link rating
router.post('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
        ratingScore: Joi.number().min(1).max(5).integer().required(),
    });
    try {
        const { linkID,ratingScore } = await validateSchema.validateAsync(req.body);
        const data = await linkRating(linkID,req.tokenData.memberName,ratingScore);
        res.send({ data, msg: "Link rating successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Link rating failed! ${error}` })
    }
})


module.exports = router;