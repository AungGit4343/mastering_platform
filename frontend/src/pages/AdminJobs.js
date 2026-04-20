import { useEffect, useState } from "react";
import api from "../api";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = () => {
    api.get("/admin/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load jobs");
      });
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await api.delete(`/admin/jobs/${id}`);
      loadJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="container">
      <h1>Manage Jobs</h1>

      {jobs.map((job) => (
        <div className="card" key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p><strong>Reward:</strong> {job.reward}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Client:</strong> {job.client?.name || "N/A"}</p>
          <p><strong>Engineer:</strong> {job.engineer?.name || "Not assigned"}</p>

          <button onClick={() => deleteJob(job.id)}>Delete Job</button>
        </div>
      ))}
    </div>
  );
}

export default AdminJobs;