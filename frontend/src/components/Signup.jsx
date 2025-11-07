import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null); setErr(null);

    if (!email.includes("@")) {
      setErr("Invalid email format.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ full_name: fullName, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.detail || data.error || "Signup failed.");
      } else {
        setMsg("Signup successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (error) {
      setErr("Network error.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Signup</h2>
        <Link to="/login">Login</Link>
      </div>
      <form className="form" onSubmit={submit}>
        <input style={{padding: "10px", borderRadius: "5px"}} value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full name" required />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Create account</button>
        {err && <div className="error">{err}</div>}
        {msg && <div className="success">{msg}</div>}
      </form>
    </div>
  );
}
