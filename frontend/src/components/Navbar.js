// Normal website navbar
import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_name");
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <h2 className="brand">AudioMarket</h2>
      </div>

      <div className="nav-right">
        {/* Not logged in */}
        {!token && (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Normal user navigation */}
        {token && !isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/jobs">Browse Jobs</Link>
            <Link to="/my-jobs">My Jobs</Link>
            <Link to="/post">Post Job</Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* Admin does not use normal dashboard */}
        {token && isAdmin && (
          <>
            <Link to="/admin">Admin Panel</Link>

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;