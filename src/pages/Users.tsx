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

  // Pagination State ✅
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, page, limit]); // Pagination dependencies ✅

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/users?page=${page}&limit=${limit}`);
      setUsers(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.pages);
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
      alert("User role updated successfully!");
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role");
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
      alert(
        `User ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully!`,
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Only Admin users can access user management.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Your role: {currentUser?.role}
          </p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">
          Manage user roles and account status (Admin only)
        </p>
      </div>

      {/* Search and Stats */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">All Users ({total})</h3>
            <p className="text-sm text-gray-600">
              Admin, Manager, and Staff users
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
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
            {search && (
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
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
                          disabled={
                            updating === user._id ||
                            user._id === currentUser?._id
                          }
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="STAFF">STAFF</option>
                        </select>
                        {user._id === currentUser?._id && (
                          <p className="text-xs text-gray-500 mt-1">
                            (Current user)
                          </p>
                        )}
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
                                user.status === "ACTIVE"
                                  ? "INACTIVE"
                                  : "ACTIVE",
                              )
                            }
                            disabled={
                              updating === user._id ||
                              user._id === currentUser?._id
                            }
                          >
                            {user.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
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
                            onClick={() =>
                              alert(
                                `User ID: ${user._id}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`,
                              )
                            }
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls ✅ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} users
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Next →
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* User Management Guide */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold mb-3">User Management Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">Role Permissions</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>ADMIN</strong>: Full system access
              </li>
              <li>
                • <strong>MANAGER</strong>: Manage projects
              </li>
              <li>
                • <strong>STAFF</strong>: View projects only
              </li>
            </ul>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">Status Guide</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>
                • <strong>ACTIVE</strong>: Can login and use system
              </li>
              <li>
                • <strong>INACTIVE</strong>: Cannot login
              </li>
              <li>• Deactivated users appear in list</li>
            </ul>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-1">Notes</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• You cannot change your own role/status</li>
              <li>• Invited users must complete registration</li>
              <li>• All changes are logged</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Users;
