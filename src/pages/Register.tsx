import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import api from "../services/api";

const Register = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [error, setError] = useState("");

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidating(false);
        return;
      }

      try {
        const response = await api.get(`/auth/validate-invite?token=${token}`);
        setValidToken(true);
        setInviteInfo(response.invite);
      } catch (err) {
        setError("Invalid or expired invitation token");
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/register-via-invite", {
        token,
        name: formData.name,
        password: formData.password,
      });

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <Card className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </Card>
      </div>
    );
  }

  if (!token || !validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center py-12">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invitation
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "This invitation link is invalid or has expired."}
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complete Registration
            </h1>
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          {/* Invite Info */}
          {inviteInfo && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Invitation Details</p>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  <span className="font-medium">Email:</span> {inviteInfo.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span> {inviteInfo.role}
                </p>
                <p className="text-xs mt-2 text-blue-600">
                  Please complete your registration below
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Password must be at least 6 characters</p>
              <p>
                • You'll be assigned the role:{" "}
                <span className="font-medium">{inviteInfo?.role}</span>
              </p>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
