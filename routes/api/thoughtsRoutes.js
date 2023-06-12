const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought } = require('../../models');

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
// the thought field is not populating when the users are called
router.post('/', async (req, res) => {
    try {
        const thoughtId = req.body._id;
        const userId = req.body.userId;

        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(userId)},
            {$push: { thoughts: thoughtId }}
        );
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.put('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId}, 
            {$set: req.body},
            { runValidators: true, new: true }
        );
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.delete('/:thoughtId', async (req, res) => {
    try {
        await Thought.findOneAndRemove({_id: req.params.thoughtId});
        res.json(`successfully deleted thought`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionBody = req.body.reactionBody;

        const thought = await Thought.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(thoughtId)},
            {$push: { reactions: req.body }}
        );
        res.json(`Successfully added a reaction to ${thought.username}'s thought`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $pull: {reactions: {reactionId: req.params.reactionId}}},
            { runValidators: true, new: true }
            );
        res.json('Successfully deleted reaction');
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router;