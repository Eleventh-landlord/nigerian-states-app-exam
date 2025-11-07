import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.detail || "Login failed.");
      } else {
        // store user in localStorage
        localStorage.setItem("nsa_user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      setErr("Network error.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Login</h2>
        <Link to="/">Signup</Link>
      </div>
      <form className="form" onSubmit={submit}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
