import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load dashboard");
      });
  }, []);

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="profile-card">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>

          <h2>{user.name}</h2>
          <p className="small">{user.email}</p>

          <div className="points-box">
            <span className="points-label">Points</span>
            <span className="points-value">{user.points}</span>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="card">
            <h2>Welcome back</h2>
            <p className="small">
              Manage your profile, points, and audio mastering jobs.
            </p>
          </div>

          <div className="dashboard-actions">
            <Link to="/jobs" className="dashboard-link-card">
              <h3>Browse Jobs</h3>
              <p>See open mastering jobs and accept work.</p>
            </Link>

            <Link to="/post" className="dashboard-link-card">
              <h3>Post a Job</h3>
              <p>Create a new job and offer points to engineers.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;