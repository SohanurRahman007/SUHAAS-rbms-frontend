import { useAuth } from "../../contexts/AuthContext";
import Button from "../Button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            {/* Mobile menu button */}
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
          <h1 className="text-xl font-bold text-gray-900">RBMS</h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
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
