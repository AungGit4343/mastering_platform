import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load admin dashboard");
      });
  }, []);

  if (!stats) {
    return (
      <div className="container">
        <div className="card">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.total_users}</p>
        </div>

        <div className="stat-card">
          <h3>Total Jobs</h3>
          <p>{stats.total_jobs}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Jobs</h3>
          <p>{stats.completed_jobs}</p>
        </div>

        <div className="stat-card">
          <h3>Open Jobs</h3>
          <p>{stats.open_jobs}</p>
        </div>

        <div className="stat-card">
          <h3>Total Points</h3>
          <p>{stats.total_points}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/users" className="dashboard-link-card">
          <h3>Manage Users</h3>
          <p>View users, points, and admin status.</p>
        </Link>

        <Link to="/admin/jobs" className="dashboard-link-card">
          <h3>Manage Jobs</h3>
          <p>View and remove jobs when needed.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;