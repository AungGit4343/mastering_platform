// Public Leaderboard Page
// Visitors can search engineers by name
// Entire row is clickable

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Leaderboard() {

  // ========================================
  // Store leaderboard data
  // ========================================
  const [engineers, setEngineers] = useState([]);

  // ========================================
  // Search input state
  // ========================================
  const [search, setSearch] = useState("");

  // Used for row click navigation
  const navigate = useNavigate();

  // ========================================
  // Load leaderboard from backend
  // ========================================
  useEffect(() => {
    api.get("/leaderboard")
      .then((res) => setEngineers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load leaderboard");
      });
  }, []);

  // ========================================
  // Filter engineers by name
  // ========================================
  const filteredEngineers = engineers.filter((engineer) =>
    engineer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">

      <h2>Engineer Leaderboard</h2>

      {/* ========================================
         Search bar
      ======================================== */}
      <div className="card">
        <input
          type="text"
          placeholder="Search engineers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ========================================
         Leaderboard table
      ======================================== */}
      <div className="card">
        <table className="admin-table clickable-table">

          <thead>
            <tr>
              <th>Rank</th>
              <th>Engineer</th>
              <th>Completed Jobs</th>
              <th>Average Rating</th>
              <th>Weighted Rating</th>
            </tr>
          </thead>

          <tbody>

            {filteredEngineers.length === 0 && (
              <tr>
                <td colSpan="5">
                  No engineers found.
                </td>
              </tr>
            )}

            {filteredEngineers.map((engineer, index) => (

              <tr
                key={engineer.id}
                className="clickable-row"
                onClick={() => navigate(`/users/${engineer.id}`)}
              >
                <td>#{index + 1}</td>

                <td>
                  {engineer.name}
                </td>

                <td>
                  {engineer.completed_jobs}
                </td>

                <td>
                  {engineer.average_rating} ★
                </td>

                <td>
                  {engineer.bayesian_rating} ★
                </td>
              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;