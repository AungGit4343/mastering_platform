// Admin user management page
import { useEffect, useState } from "react";
import api from "../api";
import AdminLayout from "../components/AdminLayout";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);

  const [pointsAction, setPointsAction] = useState("add");
  const [pointsAmount, setPointsAmount] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Load users from backend
  const loadUsers = () => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load users");
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Close edit modal
  const closeModal = () => {
    setEditingUser(null);
    setPointsAmount("");
    setPointsAction("add");
    setNewPassword("");
    setShowPassword(false);
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setPointsAmount("");
    setPointsAction("add");
    setNewPassword("");
    setShowPassword(false);
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/users/${id}`);

      alert("User deleted successfully");

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
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
                  <div className="action-buttons">
                    <button
                      onClick={() => openEditModal(user)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Edit User</h2>

            <p className="small">
              Editing <strong>{editingUser.name}</strong>
            </p>

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