import { useEffect, useState } from "react";
import axios from "axios";
import FriendButton from "./FriendButton";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const url=import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        axios.get(`${url}/api/v1/user/bulk?filter=` + filter)
            .then(response => {
                setUsers(response.data.user);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, [filter]);

    return (
        <div className="p-4">
            <div className="font-bold mt-6 text-3xl">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.length > 0 ? (
                    users.map(user => <User key={user._id} user={user} />)
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
}

function User({ user }) {
    return (
        <div className="flex justify-between items-center border-b py-2">
            <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2">
                    <div className="text-xl">{user.firstName[0]}</div>
                </div>
                <div className="flex flex-col">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>
            <div>
                <FriendButton friendId={user._id} isFriend={user.isFriend} />
            </div>
        </div>
    );
}
