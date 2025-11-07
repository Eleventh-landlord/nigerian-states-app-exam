import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StateCard from "./StateCard";

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("nsa_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchStates();
    // eslint-disable-next-line
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/states`);
      const data = await res.json();
      setStates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("nsa_user");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <h2>Nigerian States Explorer</h2>
          <div>Welcome, {user?.full_name}</div>
        </div>
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid">
          {states.map(s => <StateCard key={s.id} s={s} />)}
        </div>
      )}
    </div>
  );
}
