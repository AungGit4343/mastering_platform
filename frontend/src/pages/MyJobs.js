// My Jobs page: posted jobs + accepted jobs
import { useEffect, useState } from "react";
import api from "../api";

function MyJobs() {
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

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

  // Submit completed audio file by engineer
  const submitAudio = async (id) => {
    if (!submissionFile) {
      alert("Please choose an MP3 or WAV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", submissionFile);

    try {
      await api.post(`/jobs/${id}/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Submitted!");
      setSubmissionFile(null);
      await loadMyJobs();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Submission failed");
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

  // Client submits review for engineer
  const submitReview = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/reviews`, {
        stars: reviewStars,
        comment: reviewComment,
      });

      alert("Review submitted!");
      loadMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  // Status badge styling helper
  const getStatusClass = (status) => {
    if (status === "open") return "status-open";
    if (status === "in_progress") return "status-progress";
    if (status === "completed") return "status-completed";
    return "";
  };

  // Check if job deadline has passed

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today;
  };

  // ========================================
  // Extend deadline for a posted job
  // ========================================
  const extendDeadline = async (id) => {
    const newDeadline = prompt("Enter new deadline date: YYYY-MM-DD");

    if (!newDeadline) return;

    try {
      await api.put(`/jobs/${id}/extend-deadline`, {
        deadline: newDeadline,
      });

      alert("Deadline extended");
      loadMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to extend deadline");
    }
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

            <p>
              <strong>Deadline:</strong> {job.deadline || "No deadline"}
            </p>

            {job.status === "open" && (
              <button
                style={{ background: "#ef4444" }}
                onClick={() => deleteJob(job.id)}
              >
                Delete Job
              </button>
            )}

            {job.status === "in_progress" && job.submission_path && (
              <button onClick={() => completeJob(job.id)}>
                Mark Complete & Transfer Points
              </button>
            )}

            {/* Waiting for engineer submission */}
            {job.status === "in_progress" && !job.submission_path && (
              <p className="small">
                Waiting for engineer to submit completed work.
              </p>
            )}

            {job.submission_path && (
              <div className="audio-box">
                <p className="small">Submitted Audio</p>
                <audio
                  controls
                  src={`http://localhost:8000/storage/${job.submission_path}`}
                />
                <p className="small">
                  Work submitted. Waiting for client to complete the job.
                </p>
              </div>
            )}

            {job.status !== "completed" && isDeadlinePassed(job.deadline) && (
              <div className="deadline-box">
                <p className="small danger-text">
                  Deadline passed. You can extend the deadline or delete this job.
                </p>

                <button onClick={() => extendDeadline(job.id)}>
                  Extend Deadline
                </button>

                <button
                  className="danger-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete Job
                </button>
              </div>
            )}

            {/* Review section */}
            {job.status === "completed" && !job.review && (
              <div className="review-box">
                <h4>Leave a Review</h4>

                <select
                  value={reviewStars}
                  onChange={(e) => setReviewStars(e.target.value)}
                >
                  <option value="5">★★★★★ 5</option>
                  <option value="4">★★★★☆ 4</option>
                  <option value="3">★★★☆☆ 3</option>
                  <option value="2">★★☆☆☆ 2</option>
                  <option value="1">★☆☆☆☆ 1</option>
                </select>

                <textarea
                  placeholder="Write feedback for the engineer"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />

                <button onClick={() => submitReview(job.id)}>
                  Submit Review
                </button>
              </div>
            )}

            {job.review && (
              <div className="review-box">
                <p>
                  <strong>Your Review:</strong>{" "}
                  {"★".repeat(job.review.stars)}
                </p>

                {job.review.comment && (
                  <p>{job.review.comment}</p>
                )}
              </div>
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

            {/* Job deadline visible to engineer */}
            <p>
              <strong>Deadline:</strong> {job.deadline || "No deadline"}
            </p>

            {isDeadlinePassed(job.deadline) && job.status !== "completed" && (
              <p className="small danger-text">
                Deadline has passed. Please contact the client.
              </p>
            )}

            <p><strong>Client:</strong> {job.client?.name}</p>

            {job.status === "in_progress" && (
              <p className="small">
                Waiting for client to mark this job as complete.
              </p>
            )}

            {/* Show upload form only if work not submitted yet */}
            {job.status === "in_progress" && !job.submission_path && (
              <>
                <p className="small">
                  Submit one completed audio file (MP3 or WAV)
                </p>

                <input
                  type="file"
                  accept=".mp3,.wav,audio/mpeg,audio/wav"
                  onChange={(e) => setSubmissionFile(e.target.files[0])}
                />

                <button onClick={() => submitAudio(job.id)}>
                  Submit Work
                </button>
              </>
            )}

            {/* After submission */}
            {job.submission_path && job.status !== "completed" && (
              <div className="audio-box">
                <p className="small success-text">
                  ✅ Submitted — waiting for client approval
                </p>

                <audio
                  controls
                  src={`http://localhost:8000/storage/${job.submission_path}`}
                />
              </div>
            )}

            {job.status === "completed" && (
              <div className="audio-box">
                <p className="small success-text">
                  ✅ Completed - points transferred to your account
                </p>

                {job.submission_path && (
                  <audio
                    controls
                    src={`http://localhost:8000/storage/${job.submission_path}`}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default MyJobs;