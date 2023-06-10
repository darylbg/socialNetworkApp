const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought, Reaction } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findOne({_id: req.params.thoughtId});
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const thoughtId = req.body._id;
        const userId = req.body.userId;

        const thought = await Thought.create(req.body);
        const pushThought = await User.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(userId)},
            {$push: { thoughts: thoughtId }}
        );
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router;