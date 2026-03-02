import React from "react";

export function Leaderboard({ loggedInUser, maxStreak }) {

  let entries = [
    { id: 0, name: (loggedInUser? loggedInUser : "[You]"), streak: maxStreak},
    { id: 1, name: "Alice", streak: 6 },
    { id: 2, name: "Bob", streak: 3 }
  ];

  const sortedEntries = [...entries].sort(
    (a, b) => b.streak - a.streak
  );

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
            {sortedEntries.map((entry, index) => (
              <div key={entry.id}>
                {index + 1}. {entry.name}: <b>{entry.streak}</b> in a row
              </div>
            ))}
          </div>

          <br />
        </div>
      </div>
    </main>
  );
}
