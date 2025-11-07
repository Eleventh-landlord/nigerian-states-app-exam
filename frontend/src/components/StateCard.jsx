import React from "react";
function StateCard({ s }) {
  return (
    <div className="card">
      <h3>{s.name}</h3>
      <small><strong>Capital:</strong> {s.capital}</small><br />
      <small><strong>Region:</strong> {s.region}</small><br />
      <small><strong>Population:</strong> {s.population?.toLocaleString()}</small>
      <p style={{marginTop:8}}><em>{s.slogan}</em></p>
      <p><strong>Landmarks:</strong> {s.landmarks}</p>
    </div>
  );
}


export default StateCard;