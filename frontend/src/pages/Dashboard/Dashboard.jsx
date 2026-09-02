import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Welcome, {user?.username}
        </h2>

        <p className="mt-2 text-gray-600">
          Role: {user?.role}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;