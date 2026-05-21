// Public Leaderboard Page
// Shows engineers ranked by Bayesian rating



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Leaderboard() {
  // Store leaderboard engineers
  const [engineers, setEngineers] = useState([]);

  // Used to navigate when clicking a table row
  const navigate = useNavigate();

  // Load public leaderboard
  useEffect(() => {
    api.get("/leaderboard")
      .then((res) => setEngineers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load leaderboard");
      });
  }, []);

  return (
    <div className="container">
      <h2>Engineer Leaderboard</h2>

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
            {engineers.map((engineer, index) => (
              <tr
                key={engineer.id}
                className="clickable-row"
                onClick={() => navigate(`/users/${engineer.id}`)}
              >
                <td>#{index + 1}</td>
                <td>{engineer.name}</td>
                <td>{engineer.completed_jobs}</td>
                <td>{engineer.average_rating} ★</td>
                <td>{engineer.bayesian_rating} ★</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;