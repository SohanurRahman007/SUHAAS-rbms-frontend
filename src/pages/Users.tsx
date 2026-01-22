import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  invitedAt: string;
  createdAt: string;
}

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // Check if current user is ADMIN
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get("/users");
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      await api.patch(`/users/${userId}/role`, { role: newRole });

      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, role: newRole as User["role"] } : u,
        ),
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setUpdating(null);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      setUpdating(userId);
      await api.patch(`/users/${userId}/status`, { status: newStatus });

      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, status: newStatus as User["status"] } : u,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  // If not ADMIN, show access denied
  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Only Admin users can access this page.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Your role: {currentUser?.role}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user roles and account status</p>
      </div>

      {/* Search and Stats */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              All Users ({users.length})
            </h3>
            <p className="text-sm text-gray-600">
              Admin, Manager, and Staff users
            </p>
          </div>

          <div className="w-full md:w-64">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Invited
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={user.role}
                        onChange={(e) =>
                          updateUserRole(user._id, e.target.value)
                        }
                        disabled={updating === user._id}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="STAFF">STAFF</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateUserStatus(
                              user._id,
                              user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                            )
                          }
                          disabled={updating === user._id}
                        >
                          {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.invitedAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert(`User ID: ${user._id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
