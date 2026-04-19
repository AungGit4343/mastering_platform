import { useState } from "react";
import api from "../api";

function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");

  const submit = async () => {
    await api.post("/jobs", { title, description, reward });
    alert("Job posted!");
    window.location.href = "/jobs";
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create a Job</h2>

        <input placeholder="Job title" onChange={e => setTitle(e.target.value)} />

        <textarea placeholder="Describe the task" onChange={e => setDescription(e.target.value)} />

        <input type="number" placeholder="Reward (points)" onChange={e => setReward(e.target.value)} />

        <button onClick={submit}>Post Job</button>
      </div>
    </div>
  );
}

export default PostJob;