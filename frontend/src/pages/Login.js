import { useState } from "react";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/jobs";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Welcome Back</h2>
        <p className="small">Login to continue</p>

        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;