const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought, Reaction } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const thought = await Thought.create(req.body);
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});