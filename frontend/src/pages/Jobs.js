import { useEffect, useState } from "react";
import api from "../api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then(res => setJobs(res.data));
  }, []);

  const acceptJob = async (id) => {
    await api.post(`/jobs/${id}/accept`);
    alert("Job accepted!");
  };

  return (
    <div className="container">
      <h2>Available Jobs</h2>

      {jobs.map(job => (
        <div className="card" key={job.id}>
          <h3>{job.title}</h3>
          <p className="small">{job.description}</p>

          <p><strong>{job.reward} points</strong></p>

          {job.status === "open" && (
            <button onClick={() => acceptJob(job.id)}>
              Accept Job
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Jobs;