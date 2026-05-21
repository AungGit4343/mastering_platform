// Website Navbar Component


import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {

  // Get auth data from localStorage
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  // Logout current user
 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_name");

    // Redirect to login page
    window.location.href = "/login";
  };

  return (

    // Main Navbar
    
    <nav className="navbar">

      {/* Website Logo + Brand*/}
      <div className="nav-left">

        <Link to="/" className="brand-link logo-wrap">

          {/* Website logo image */}
          <img
            src={logo}
            alt="SecondEars Logo"
            className="site-logo"
          />

          {/* Brand text */}
          <div>
            <h2 className="brand">
              SecondEars
            </h2>

            <p className="brand-subtitle">
              Another set of ears for your music
            </p>
          </div>

        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-right">

        {/*Guest Navigation */}
        {!token && (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* Normal User Navigation*/}
        {token && !isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>

            <Link to="/jobs">
              Browse Jobs
            </Link>

            <Link to="/my-jobs">
              My Jobs
            </Link>

            <Link to="/post">
              Post Job
            </Link>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

        {/*Admin Navigation */}
        {token && isAdmin && (
          <>
            <Link to="/admin">
              Admin Panel
            </Link>

            <Link to="/admin/users">
              Users
            </Link>

            <Link to="/admin/jobs">
              Jobs
            </Link>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;