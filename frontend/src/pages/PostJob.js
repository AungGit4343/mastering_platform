import { useState } from "react";
import api from "../api";

function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [audio, setAudio] = useState(null);

  const postJob = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("reward", reward);
    formData.append("audio", audio);

    try {
      await api.post("/jobs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Job posted!");
      window.location.href = "/my-jobs";
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create a Job</h2>

        <input placeholder="Job title" onChange={e => setTitle(e.target.value)} />

        <textarea placeholder="Describe the task" onChange={e => setDescription(e.target.value)} />

        <input type="number" placeholder="Reward (points)" onChange={e => setReward(e.target.value)} />
        <p className="small">
          Please upload one high-quality WAV file or mp3.
        </p>
        <input 
        type="file" 
        accept=",mp3,.wav,audio/mpeg,audio/wav"
        onChange={e => setAudio(e.target.files[0])} />

        <button onClick={postJob}>Post Job</button>
      </div>
    </div>
  );
}

export default PostJob;