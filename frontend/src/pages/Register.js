import { useState } from "react";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Required profile information
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const register = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,

        about,
        education,
        experience
      });

      alert("Registered successfully");
      window.location.href = "/";
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Required profile details */}
        <textarea
          placeholder="About yourself"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <textarea
          placeholder="Education background"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        <textarea
          placeholder="Experience in audio/mastering"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}

export default Register;