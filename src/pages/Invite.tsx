import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

const Invite = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "ADMIN";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/invite", { email, role });

      setInviteData(response.invite);
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

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
            Only Admin users can invite new users.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Invite User</h1>
        <p className="text-gray-600">Send invitation to join the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Form */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Send Invitation</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                Invite sent successfully!
              </p>
            </div>
          )}

          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This user will be assigned the selected role
              </p>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Send Invitation
            </Button>
          </form>
        </Card>

        {/* Invite Information & Preview */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">
                Invitation Process
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                <li>Admin sends invite with email and role</li>
                <li>Invite token generated (valid for 24 hours)</li>
                <li>User receives email with registration link</li>
                <li>User completes registration with token</li>
                <li>User account created with assigned role</li>
              </ol>
            </div>

            {inviteData && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">
                  Invite Sent!
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">To:</span> {inviteData.email}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span> {inviteData.role}
                  </p>
                  <p>
                    <span className="font-medium">Expires:</span>{" "}
                    {new Date(inviteData.expiresAt).toLocaleString()}
                  </p>
                  <p className="mt-3 font-medium">Invite Link (for testing):</p>
                  <div className="p-2 bg-white border rounded text-xs break-all">
                    {inviteData.inviteLink}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Note: In production, this link would be sent via email
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">
                Note for Testing
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Copy the invite token/link above</li>
                <li>• Open new browser/incognito window</li>
                <li>
                  • Go to: http://localhost:5173/register?token=TOKEN_HERE
                </li>
                <li>• Complete registration form</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Invite;
