// My Jobs page: posted jobs + accepted jobs
import { useEffect, useState } from "react";
import api from "../api";

function MyJobs() {
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);

  // Load jobs created and accepted by logged-in user
  const loadMyJobs = async () => {
    try {
      const posted = await api.get("/my-posted-jobs");
      const accepted = await api.get("/my-accepted-jobs");

      setPostedJobs(posted.data);
      setAcceptedJobs(accepted.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load my jobs");
    }
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  // Client marks job complete and transfers points
  const completeJob = async (id) => {
    try {
      await api.post(`/jobs/${id}/complete`);
      alert("Job completed. Points transferred!");
      loadMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete job");
    }
  };

  // Status badge styling helper
  const getStatusClass = (status) => {
    if (status === "open") return "status-open";
    if (status === "in_progress") return "status-progress";
    if (status === "completed") return "status-completed";
    return "";
  };

  return (
    <div className="container">
      <h2>My Jobs</h2>

      {/* Jobs posted by logged-in user */}
      <section>
        <h3>Jobs I Posted</h3>

        {postedJobs.length === 0 && (
          <div className="card">
            <p>You have not posted any jobs yet.</p>
          </div>
        )}

        {postedJobs.map((job) => (
          <div className="card" key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>

            <p><strong>Reward:</strong> {job.reward} points</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${getStatusClass(job.status)}`}>
                {job.status}
              </span>
            </p>

            <p>
              <strong>Engineer:</strong>{" "}
              {job.engineer ? job.engineer.name : "Not accepted yet"}
            </p>

            {job.status === "in_progress" && (
              <button onClick={() => completeJob(job.id)}>
                Mark Complete & Transfer Points
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Jobs accepted by logged-in user */}
      <section>
        <h3>Jobs I Accepted</h3>

        {acceptedJobs.length === 0 && (
          <div className="card">
            <p>You have not accepted any jobs yet.</p>
          </div>
        )}

        {acceptedJobs.map((job) => (
          <div className="card" key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>

            <p><strong>Reward:</strong> {job.reward} points</p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${getStatusClass(job.status)}`}>
                {job.status}
              </span>
            </p>

            <p><strong>Client:</strong> {job.client?.name}</p>

            {job.status === "in_progress" && (
              <p className="small">
                Waiting for client to mark this job as complete.
              </p>
            )}

            {job.status === "completed" && (
              <p className="small">
                Completed. Points have been transferred.
              </p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default MyJobs;