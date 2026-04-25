// My Jobs page: posted jobs + accepted jobs
import { useEffect, useState } from "react";
import api from "../api";

function MyJobs() {
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  
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

  //Submit Audio
  const submitAudio = async (id) => {
  const formData = new FormData();
  formData.append("audio", submissionFile);

  try {
    await api.post(`/jobs/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Submitted!");

    // Refresh job lists to reflect submission
      setAcceptedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== id)
    );

    setSubmissionFile(null);

  } catch (err) {
    alert("Submission failed");
  }
};

  useEffect(() => {
    loadMyJobs();
  }, []);

  //Delete Job
  const deleteJob = async (id) => {
  if (!window.confirm("Are you sure you want to delete this job?")) return;

  try {
    await api.delete(`/jobs/${id}`);
    alert("Job deleted");
    loadMyJobs();
  } catch (err) {
    alert(err.response?.data?.message || "Delete failed");
  }
};

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
            
            {/*Submit mp3 or wav*/}
            <p className="small">
              Submit one completed audio file (MP3 or WAV)
            </p>

            <input
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={(e) => setSubmissionFile(e.target.files[0])}
            />
            
            {job.status === "open" && (
              <button
                style={{ background: "#ef4444" }}
                onClick={() => deleteJob(job.id)}
              >
                Delete Job
              </button>
            )}
            {job.status === "in_progress" && (
              <button onClick={() => completeJob(job.id)}>
                Mark Complete & Transfer Points
              </button>
            )}

            {job.submission_path && (
              <>
                <p>Submitted Audio:</p>
                <audio controls src={`http://localhost:8000/storage/${job.submission_path}`} />
              </>
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

            {job.status === "in_progress" && (
              <>
                <input type="file" onChange={e => setSubmissionFile(e.target.files[0])} />
                <button onClick={() => submitAudio(job.id)}>
                  Submit Work
                </button>
              </>
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