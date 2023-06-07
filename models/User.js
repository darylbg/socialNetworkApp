const mongoose = require('mongoose');
const Thought = require('./Thought')

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            unique: true, 
            required: true, 
            trim: true
        },
        email: {
            type: String, 
            unique: true, 
            required: true,
            match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        },
        thoughts: [Thought],
        friends: [ User ]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

userSchema.virtual('friendcount').get(function () {
    return this.friends.length;
});

const User = mongoose.model('user', userSchema);

module.exports = User;