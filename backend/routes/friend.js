const express = require('express');
const router = express.Router();
const {User} = require('../db.js');
const { authMiddleware } = require('../middleware.js'); // Update import to use authMiddleware


// Add a friend
// Send friend request
router.post('/add-friend/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const friend = await User.findById(req.params.id);

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if they are already friends
        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Check if there's already a pending request
        if (friend.friendRequests.includes(user._id)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // Send friend request
        friend.friendRequests.push(user._id);
        await friend.save();

        res.json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Accept or reject a friend request
router.post('/respond-friend-request/:id', authMiddleware, async (req, res) => {
    const { action } = req.body; // action: 'accept' or 'reject'

    try {
        const user = await User.findById(req.userId);
        const friend = await User.findById(req.params.id);

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friend request exists
        if (!user.friendRequests.includes(friend._id)) {
            return res.status(400).json({ message: 'No friend request found' });
        }

        if (action === 'accept') {
            // Add friend to both users' friend lists
            user.friends.push(friend._id);
            friend.friends.push(user._id);
        }

        // Remove the friend request
        user.friendRequests = user.friendRequests.filter(requestId => requestId.toString() !== friend._id.toString());
        await user.save();
        await friend.save();

        res.json({ message: action === 'accept' ? 'Friend request accepted' : 'Friend request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Unfriend
router.delete('/unfriend/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Get the current user using userId from the token
        const friend = await User.findById(req.params.id);

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if they are friends
        if (!user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'Not friends' });
        }

        // Remove friend
        user.friends = user.friends.filter(friendId => friendId.toString() !== friend._id.toString());
        await user.save();

        res.json({ message: 'Unfriended successfully', friends: user.friends });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/is-friend/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // Get the current user
        const isFriend = user.friends.includes(req.params.id);

        res.json({ isFriend });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all friends and pending requests
router.get('/all-friends', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('friends', 'username firstName lastName')
            .populate('friendRequests', 'username firstName lastName');

        res.json({
            friends: user.friends,
            friendRequests: user.friendRequests, // Include pending friend requests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
