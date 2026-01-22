import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Total Projects", value: "12", color: "bg-blue-500" },
    { label: "Active Users", value: "8", color: "bg-green-500" },
    { label: "Pending Tasks", value: "5", color: "bg-yellow-500" },
    { label: "Admin Actions", value: "24", color: "bg-purple-500" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white font-bold">+</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Info Card */}
      <Card title="Your Profile" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-6 00">Status</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  user?.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user?.status}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium">Create Project</h4>
            <p className="text-sm text-gray-600 mt-1">Start a new project</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium">View Users</h4>
            <p className="text-sm text-gray-600 mt-1">Manage team members</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h4 className="font-medium">Settings</h4>
            <p className="text-sm text-gray-600 mt-1">System configuration</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
