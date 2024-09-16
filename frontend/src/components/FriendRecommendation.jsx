import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendButton from './FriendButton'; // Ensure this path is correct

const FriendRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const url = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`${url}/api/v1/user/recommendations`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRecommendations(response.data.recommendations);
            } catch (error) {
                setError('Error fetching recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className='mt-5'>
            <h3 className='text-2xl font-bold'>Recommendations</h3>
            {loading ? (
                <p>Loading recommendations...</p>
            ) : error ? (
                <p>{error}</p>
            ) : recommendations.length === 0 ? (
                <p>No friend recommendations available.</p>
            ) : (
                <div>
                    <h2>Recommended Friends</h2>
                    <ul>
                        {recommendations.map(rec => (
                            <li key={rec._id} className="flex justify-between items-center border-b py-2">
                                <div className="flex items-center">
                                    <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
                                        <div className="text-xl">{rec.firstName[0]}</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div>
                                            {rec.firstName} {rec.lastName}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <FriendButton friendId={rec._id} isFriend={false} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FriendRecommendations;
