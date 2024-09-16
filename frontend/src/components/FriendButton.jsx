import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url=import.meta.env.VITE_BACKEND_URL;

const addFriend = async (friendId) => {
    try {
        const response = await axios.post(
            `${url}/api/v1/friend/add-friend/${friendId}`,
            {}, 
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error.response.data.message);
        throw error;
    }
};


const unfriend = async (friendId) => {
    try {
        const response = await axios.delete(
            `${url}/api/v1/friend/unfriend/${friendId}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error.response.data.message);
        throw error;
    }
};


const isFriendCheck = async (friendId) => {
    try {
        const response = await axios.get(
            `${url}/api/v1/friend/is-friend/${friendId}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            }
        );
        return response.data.isFriend;
    } catch (error) {
        console.error(error.response.data.message);
        throw error;
    }
};

const FriendButton = ({ friendId }) => {
    const [friendStatus, setFriendStatus] = useState(false);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const fetchFriendStatus = async () => {
            setLoading(true);
            try {
                const status = await isFriendCheck(friendId);
                setFriendStatus(status);
            } catch (error) {
                console.error('Error fetching friend status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [friendId]);

    const handleAddFriend = async () => {
        setLoading(true);
        try {
            await addFriend(friendId);
            setFriendStatus(true);
        } catch (error) {
            console.error('Error adding friend:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfriend = async () => {
        setLoading(true);
        try {
            await unfriend(friendId);
            setFriendStatus(false);
        } catch (error) {
            console.error('Error unfriending:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {friendStatus ? (
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleUnfriend}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Unfriend'}
                </button>
            ) : (
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={handleAddFriend}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Add Friend'}
                </button>
            )}
        </div>
    );
};

export default FriendButton;

