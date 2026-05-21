import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin") === "true";

    if (isAdmin) {
      window.location.href = "/admin";
      return;
    }

    api.get("/me")
      .then((res) => {
        setUser(res.data);
        setEmail(res.data.email || "");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load dashboard");
      });
  }, []);

  const openEditModal = () => {
    setEmail(user.email || "");
    setPassword("");
    setPasswordConfirmation("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setPassword("");
    setPasswordConfirmation("");
  };

  const updateProfile = async () => {
    try {
      await api.put("/profile", {
        email,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      });

      alert("Profile updated!");

      const res = await api.get("/me");
      setUser(res.data);
      setEmail(res.data.email || "");

      closeEditModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

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

          <button onClick={openEditModal}>Edit Profile</button>
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

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Edit Profile</h2>
            <p className="small">Username cannot be changed.</p>

            <label>Name / Username</label>
            <input value={user.name} disabled />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <button onClick={updateProfile}>Save Profile</button>

            <button className="cancel-btn" onClick={closeEditModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;