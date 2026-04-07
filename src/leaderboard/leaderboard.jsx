import React, { useState, useEffect } from "react";

export function Leaderboard({ loggedInUser }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/scores", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const uniqueScores = {};
        data.forEach((entry) => {
          if (!uniqueScores[entry.username] || entry.score > uniqueScores[entry.username]) {
            uniqueScores[entry.username] = entry.score;
          }
        });

        const cleanedEntries = Object.entries(uniqueScores).map(([username, score]) => ({
          username,
          score,
        }));

        setEntries(cleanedEntries);
      })
      .catch((err) => console.error(err));
  }, []);

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <main>
      <br />
      <br />

      <div className="centerdiv">
        <div className="centerdiv panel" style={{ width: "50%" }}>
          <h1>Leaderboard</h1>

          <div
            style={{
              textAlign: "left",
              width: "85%",
              height: "50vh",
              overflowY: "auto",
            }}
          >
            {sortedEntries.map((entry, index) => (
              <div key={entry.username}>
                {index + 1}. {entry.username}: <b>{entry.score}</b> in a row
              </div>
            ))}
          </div>

          <br />
        </div>
      </div>
    </main>
  );
}