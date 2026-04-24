// Separate admin layout with sidebar
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  // Logout admin/user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_name");
    window.location.href = "/";
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">AudioMarket Admin</h2>

        <nav className="admin-menu">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/jobs">Jobs</Link>
          <Link to="/jobs">View Site</Link>
        </nav>

        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* Admin page content */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;