const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { linkRating } = require('../services/ratings');
const auth = require('../middlewares/auth');

// TODO 待实现根据linkID和rater获取该评分人评价该link的分数

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