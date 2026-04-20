import { Link } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <h2 className="brand">SecondEars</h2>
      </div>

      <div className="nav-right">
        {/* If NOT logged in */}
        {!token && (
          <>
            <Link to="/">Login</Link>
          </>
        )}

        {/* If logged in */}
        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/post">Post Job</Link>
            <Link to="/admin">Admin</Link>

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