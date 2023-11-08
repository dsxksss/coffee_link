const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { getAllLinks, createLink, updateLink, deleteLink } = require('../services/links');
const auth = require('../middlewares/auth');

// Get all links
router.get('/', async (_, res) => {
    try {
        const data = await getAllLinks();
        res.send({ data, msg: "Get all links successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Get all link failed! ${error}` })
    }
})


// Create link
router.post('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkURL: Joi.string().pattern(new RegExp('^https?://.+?$')).min(5).max(250).required(),
        linkTitle: Joi.string().min(2).max(250).required(),
        linkDescription: Joi.string().min(5).max(250).required(),
        hidden: Joi.boolean().required(),
    });
    try {
        const { linkURL, linkTitle, linkDescription, hidden } = await validateSchema.validateAsync(req.body);
        const data = await createLink(linkURL, linkTitle, linkDescription, req.tokenData.memberName, hidden);
        res.send({ data, msg: "Create link successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Create link failed! ${error}` })
    }
});

// Update Link
router.put('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
        newLinkURL: Joi.string().pattern(new RegExp('^https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,30}(/[a-zA-Z0-9_\\-./?%&=]*)?$')).min(5).max(250).required(),
        newLinkTitle: Joi.string().min(2).max(250).required(),
        newLinkDescription: Joi.string().min(5).max(250).required(),
        newHidden: Joi.boolean().required(),
    });
    try {
        const { linkID, newLinkURL, newLinkTitle, newLinkDescription, newHidden } = await validateSchema.validateAsync(req.body);
        const data = await updateLink(linkID, req.tokenData.memberName, newLinkURL, newLinkTitle, newLinkDescription, newHidden);
        res.send({ data, msg: "Update Link information successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Update Link information failed! ${error}` })
    }
});

// Delete Link
router.delete('/', auth, async (req, res) => {
    const validateSchema = Joi.object({
        linkID: Joi.string().min(10).max(250).required(),
    });
    try {
        const { linkID } = await validateSchema.validateAsync(req.body);
        await deleteLink(linkID, req.tokenData.memberName);
        res.send({ msg: "Delete Link successfully" });
    } catch (error) {
        res.status(400).send({ msg: `Delete Link failed! ${error}` })
    }
});

module.exports = router;