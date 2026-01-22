import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const navItems = [
    { to: "/dashboard", icon: "📊", label: "Dashboard" },
    { to: "/projects", icon: "📁", label: "Projects" },
  ];

  if (isAdmin) {
    navItems.push(
      { to: "/users", icon: "👥", label: "Users" },
      { to: "/invite", icon: "📨", label: "Invite User" },
    );
  }

  return (
    <aside className="hidden md:block w-64 border-r bg-white min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="absolute bottom-0 w-64 p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="font-bold text-blue-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
