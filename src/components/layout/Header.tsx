import { useAuth } from "../../contexts/AuthContext";
import Button from "../Button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            {/* Mobile menu button - optional */}
            <button className="p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800" />
            <h1 className="text-xl font-bold text-gray-900">RBMS Dashboard</h1>
            {user && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {user.role}
              </span>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600 text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
