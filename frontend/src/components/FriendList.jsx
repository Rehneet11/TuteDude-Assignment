import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url=import.meta.env.VITE_BACKEND_URL;
const fetchFriends = async () => {
    try {
        const response = await axios.get(`${url}/api/v1/friend/all-friends`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token'),
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error.response.data.message);
        throw error;
    }
};

const respondFriendRequest = async (friendId, action) => {
    try {
        const response = await axios.post(
            `${url}/api/v1/friend/respond-friend-request/${friendId}`,
            { action },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error responding to friend request:', error.response.data.message);
        throw error;
    }
};

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getFriends = async () => {
            try {
                setLoading(true);
                const { friends, friendRequests } = await fetchFriends();
                setFriends(friends);
                setFriendRequests(friendRequests);
            } catch (error) {
                setError('Error fetching friends');
            } finally {
                setLoading(false);
            }
        };

        getFriends();
    }, []);

    const handleAcceptRequest = async (friendId) => {
        try {
            await respondFriendRequest(friendId, 'accept');
            setFriendRequests(friendRequests.filter(request => request._id !== friendId));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (friendId) => {
        try {
            await respondFriendRequest(friendId, 'reject');
            setFriendRequests(friendRequests.filter(request => request._id !== friendId));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
            {friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend._id} className="mb-4 p-4 border rounded-md">
                            <p><strong>Name:</strong> {friend.firstName} {friend.lastName}</p>
                            <p><strong>Username:</strong> {friend.username}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have no friends yet.</p>
            )}

            <h2 className="text-2xl font-bold mt-6 mb-4">Friend Requests</h2>
            {friendRequests.length > 0 ? (
                <ul>
                    {friendRequests.map(request => (
                        <li key={request._id} className="mb-4 p-4 border rounded-md">
                            <p><strong>Name:</strong> {request.firstName} {request.lastName}</p>
                            <p><strong>Username:</strong> {request.username}</p>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                                onClick={() => handleAcceptRequest(request._id)}
                            >
                                Accept
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleRejectRequest(request._id)}
                            >
                                Reject
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending friend requests.</p>
            )}
        </div>
    );
};

export default FriendList;
