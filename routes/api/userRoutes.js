const router = require('express').Router();
const { User, Thought, Reaction } = require('../../models');
const { findOneAndDelete } = require('../../models/Thought');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        res.json(user)
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser)
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.userId}, 
            {$set: req.body},
            { runValidators: true, new: true }
        );
        res.json(updateUser);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        await User.findOneAndRemove({_id: req.params.userId});
        res.json(`successfully deleted user: ${user.username}`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.create(
            {_id: req.params.userId},
            {$set: req.body.friends},
            { runValidators: true, new: true }
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router