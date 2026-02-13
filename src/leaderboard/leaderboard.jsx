import React from "react";

export function Leaderboard() {
  return (
    <main>
      <br />
      <br />

      <div className="centerdiv">
        <div
          className="centerdiv panel"
          style={{ width: "50%" }}
        >
          <div>
            <h1>Leaderboard</h1>
          </div>

          <div style={{ textAlign: "left", width: "85%", height: "50vh" }}>
            1. User: X in a row <br />
            2. User: Y in a row
          </div>

          <br />
        </div>
      </div>
    </main>
  );
}
