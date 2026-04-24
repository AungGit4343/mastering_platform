// Browse jobs page
import { useEffect, useState } from "react";
import api from "../api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  // Load only open jobs from other users
  const loadJobs = () => {
    api.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load jobs");
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Accept selected job
  const acceptJob = async (id) => {
    try {
      await api.post(`/jobs/${id}/accept`);
      alert("Job accepted!");
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept job");
    }
    
  };

  return (
    <div className="container">
      <h2>Browse Jobs</h2>

      {jobs.length === 0 && (
        <div className="card">
          <p>No open jobs available right now.</p>
        </div>
      )}

      {jobs.map((job) => (
        <div className="card" key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><strong>Reward:</strong> {job.reward} points</p>
          <p><strong>Client:</strong> {job.client?.name}</p>

          <button onClick={() => acceptJob(job.id)}>
            Accept Job
          </button>
          
          <audio controls src={`http://localhost:8000/storage/${job.audio_path}`} />
        
        </div>
      ))}
    </div>
  );
}

export default Jobs;