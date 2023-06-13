const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Thought } = require('../../models');
// the thoughts field is not populating ??? fix
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
        res.json(user);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const { username, email } = req.body;

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser || existingEmail) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const newUser = await User.create(req.body);

        res.json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
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
        await Thought.deleteMany({username: user.username});
        await User.findOneAndRemove({_id: req.params.userId});
        res.json(`successfully deleted user: ${user.username} and all ${user.username}'s thoughts`);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendId = req.params.friendId;

        if (userId === friendId) {
            return res.json(`You can't add yourself as a friend lol. Go make some friends`);
        }

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { runValidators: true, new: true }
        );

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
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