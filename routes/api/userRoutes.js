const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought, Reaction } = require('../../models');

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        .populate('thoughts');
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId})
        .populate('thoughts');
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
        const userId = req.params.userId;
        const friendId = req.params.friendId;

        if(userId === friendId) {
            res.json(`You can't add yourself as a friend lol. Go make some friends`)
        }

        const user = await User.findOneAndUpdate(
            {_id: userId},
            {$addToSet: { friends: new mongoose.Types.ObjectId(friendId) }},
            { runValidators: true, new: true }
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        const user = await User.findOneAndUpdate(
            {_id: userId},
            {$pull: { friends: friendId }},
            { runValidators: true, new: true }
        );
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

module.exports = router