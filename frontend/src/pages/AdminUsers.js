// Admin user management page
import { useEffect, useState } from "react";
import api from "../api";
import AdminLayout from "../components/AdminLayout";

function AdminUsers() {
  // Stores all users from backend
  const [users, setUsers] = useState([]);

  // Stores selected user for popup editing
  const [editingUser, setEditingUser] = useState(null);

  // Points adjustment states
  const [pointsAction, setPointsAction] = useState("add");
  const [pointsAmount, setPointsAmount] = useState("");

  // Password reset states
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Load users from backend
  const loadUsers = () => {
    api.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load users");
      });
  };

  // Load users when page opens
  useEffect(() => {
    loadUsers();
  }, []);

  // Close modal and reset fields
  const closeModal = () => {
    setEditingUser(null);
    setPointsAmount("");
    setPointsAction("add");
    setNewPassword("");
    setShowPassword(false);
  };

  // Save user update: points and/or password
  const saveChanges = async () => {
    const amount = parseInt(pointsAmount || 0);

    const pointsChange =
      pointsAction === "subtract" ? -Math.abs(amount) : Math.abs(amount);

    try {
      await api.put(`/admin/users/${editingUser.id}`, {
        points_change: amount ? pointsChange : undefined,
        password: newPassword || undefined,
        password_confirmation: newPassword || undefined,
      });

      alert("User updated");
      closeModal();
      loadUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <AdminLayout>
      <h1>Manage Users</h1>

      {/* Users table */}
      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.points}</td>
                <td>{user.is_admin ? "Yes" : "No"}</td>

                <td>
                  <button
                    className="small-btn"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit user popup modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Edit User</h2>

            <p className="small">
              Editing <strong>{editingUser.name}</strong>
            </p>

            {/* Points change section */}
            <label>Points Change</label>

            <div className="points-control">
              <select
                value={pointsAction}
                onChange={(e) => setPointsAction(e.target.value)}
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
              </select>

              <input
                type="number"
                placeholder="Enter points"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
              />
            </div>

            {/* Password change section */}
            <label>Password Change</label>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <span
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Save and cancel buttons */}
            <button onClick={saveChanges}>Save Changes</button>

            <button className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;