import { Appbar } from "../components/Appbar"
import FriendList from "../components/FriendList"
import FriendRecommendations from "../components/FriendRecommendation"
import { Users } from "../components/Users"


export const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Appbar />
      <div className="flex-1 p-8">
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <div className="space-y-4">
            <FriendList />
            <FriendRecommendations />
          </div>
          <Users />

        </div>
    </div>
    </div>
  );
};
export default Dashboard;
