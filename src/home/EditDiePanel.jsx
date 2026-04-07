import React, { useState } from "react";

export function EditDiePanel({ onClose, faces, setFaces }) {
  const [draft, setDraft] = useState([...faces]);
  const [saving, setSaving] = useState(false);
  const total = draft.reduce((a, b) => a + b, 0);

  function updateFace(index, value) {
    const newDraft = [...draft];
    newDraft[index] = Number(value) || 0;
    setDraft(newDraft);
  }

  async function handleSave() {
    if (total !== 21) return;

    setSaving(true);
    try {
      const res = await fetch("/api/die", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ die: draft }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.msg || "Failed to save die");
        setSaving(false);
        return;
      }

      const updatedDie = await res.json();
      setFaces(updatedDie.die); // update local state
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving die");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content panel" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Your Die</h2>

        {draft.map((f, i) => (
          <div key={i}>
            Face {i + 1}:{" "}
            <input
              type="number"
              min="0"
              max="21"
              value={f}
              onChange={(e) => updateFace(i, e.target.value)}
            />
          </div>
        ))}

        <br />
        Total:{" "}
        <b style={{ color: total === 21 ? "green" : "red" }}>{total}</b>/21
        <br />

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} disabled={saving}>
            Close
          </button>
          <button disabled={total !== 21 || saving} onClick={handleSave}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengePanel({ onClose, faces, loggedInUser,
  streak, setStreak, 
  maxStreak, setMaxStreak}) {

  const [userRoll, setUserRoll] = useState(null);
  const [enemyRoll, setEnemyRoll] = useState(null);
  const [challenger, setChallenger] = useState({username: "opponent", die: [1,2,3,4,5,6]});


  useEffect(() => {
    async function fetchChallenger() {
      try {
        const res = await fetch("/api/dice", {
          method: "GET",
          credentials: "include"
        });

        const data = await res.json();
        console.log(data);
        setChallenger(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchChallenger();
  }, []);

  async function handleChallenge() {
    const userResult = rollDie(faces);
    const enemyResult = rollDie(challenger.die);

    setUserRoll(userResult);
    setEnemyRoll(enemyResult);

    GameNotifier.broadcastEvent(loggedInUser, GameEvent.DieNotif, {
      defender: challenger.username,
      gameStatus: userResult > enemyResult ? "lost" 
                : userResult < enemyResult ? "won" 
                : "tied"
    });

    let newStreak = streak;

    if (userResult > enemyResult) {
      newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(max => Math.max(max, newStreak));

      if (newStreak % 5 === 0) {
        GameNotifier.broadcastEvent(loggedInUser, GameEvent.Streak, {
            streak: newStreak
          });
      }
    } 
    else if (userResult < enemyResult) {
      newStreak = 0;
      setStreak(0);
    }

    try {
      await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ score: newStreak })
      });
    } catch (err) {
      console.error("Failed to save score", err);
    }
  }

  function rollDie(die) {
    const index = Math.floor(Math.random() * 6);
    return die[index];
  }

  return (
    <div className="popup" onClick={onClose}>
      <div
        className="popup-content panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Challenge</h2>

        {userRoll == null && challenger.die && (
          <div>
          {challenger.username}'s die
          <div className = "centerdiv">
            <br />
            <table className="center" style={{ margin: "auto" }}>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ backgroundColor: "purple" }}>
                    <img
                      src={`/dice_faces/${challenger.die[0]}.png`}
                      className="fill"
                      alt="1"
                    />
                  </td>
                <td></td>
                </tr>

                <tr>
                  <td style={{ backgroundColor: "green" }}>
                    <img
                      src={`/dice_faces/${challenger.die[2]}.png`}
                      className="fill"
                      alt="3"
                    />
                  </td>

                  <td style={{ backgroundColor: "red" }}>
                    <img
                      src={`/dice_faces/${challenger.die[1]}.png`}
                      className="fill"
                      alt="2"
                    />
                  </td>

                  <td style={{ backgroundColor: "yellow" }}>
                    <img
                      src={`/dice_faces/${challenger.die[3]}.png`}
                      className="fill"
                      alt="4"
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ backgroundColor: "orange" }}>
                    <img
                      src={`/dice_faces/${challenger.die[5]}.png`}
                      className="fill"
                      alt="6"
                    />
                  </td>
                  <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ backgroundColor: "blue" }}>
                    <img
                      src={`/dice_faces/${challenger.die[4]}.png`}
                      className="fill"
                      alt="5"
                    />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        )}

        {userRoll !== null && (
          <div className = "centerdiv">
            <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
              
              <div className = "center">
                <p><b>You <br /> Rolled</b></p>
                <img
                  src={`/dice_faces/${userRoll}.png`}
                  style = {{ width: "100px" }}
                  alt="your roll"
                />
              </div>

              <div className = "center">
                <p><b>{challenger.username} <br /> Rolled</b></p>
                <img
                  src={`/dice_faces/${enemyRoll}.png`}
                  style = {{ width: "100px" }}
                  alt="enemy roll"
                />
              </div>

            </div>

            <h2 style={{
              marginTop: "20px",
              color:
                userRoll > enemyRoll
                  ? "green"
                  : userRoll < enemyRoll
                  ? "red"
                  : "gray"
            }}>
              {userRoll > enemyRoll
                ? "You Win!"
                : userRoll < enemyRoll
                ? "You Lose!"
                : "Tie!"}
            </h2>

          </div>
        )}

        <br />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose}>
            Close
          </button>
          {userRoll == null && (
            <button onClick={handleChallenge}> 
              Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );

}