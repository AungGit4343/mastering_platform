import { useEffect, useState } from "react";
import api from "../api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load users");
      });
  }, []);

  return (
    <div className="container">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;