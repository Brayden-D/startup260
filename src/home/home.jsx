import React, { useState, useEffect } from "react";
import './home.css';
import { generatePath } from "react-router-dom";

export function Home({ maxStreak, setMaxStreak }) {

  const [showEdit, setShowEdit] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [faces, setFaces] = useState([1, 2, 3, 4, 5, 6]);
  const [challenger, setChallenger] = useState([0, 0, 0, 0, 0, 0]);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Placeholder notif 1" },
    { id: 2, text: "Placeholder notif 2" },
    { id: 3, text: "wow look at this websocket" }
  ]);

  /* temp generator until database is implimented */
  function generateChallenger() {
    const arr = [0,0,0,0,0,0];

    for (let i = 0; i < 21; i++) {
      arr[Math.floor(Math.random() * 6)]++;
    }

    setChallenger(arr);
  }

  const addNotification = (text) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), text }
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  useEffect(() => {
    const messages = [
      "Your die was beaten by Bob!",
      "Alice is on a streak!",
      "Your die tied with Alice!",
    ];

    const interval = setInterval(() => {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      addNotification(randomMessage);
    }, 45000 + Math.random() * 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <aside className="notifbox panel">
        <div
          className="centerdiv"
          style={{
            backgroundColor: "tan",
            fontFamily: "Roboto",
            height: "25px",
            lineHeight: "25px",
          }}
        >
          <b>Notifications</b>
        </div>

        {notifications.map((notif) => (
          <div key={notif.id}>
            <div className="notification">
              {notif.text}
              <br />
              <button 
                className = "remove-btn"
                onClick={() => removeNotification(notif.id)}>
                ✖
              </button>
            </div>
          </div>
        ))}
      </aside>

      <main>
        <br />

        <div className="center">
          <button className="bigbutton" 
            onClick={() => setShowEdit(true)}>
            <b>Edit Die</b>
          </button>

          &nbsp;&nbsp;&nbsp;

          <button className="bigbutton" 
            onClick={() => {
              generateChallenger();
              setShowChallenge(true);
              }}>
            <b>Challenge</b>
          </button>
        </div>

        <br />
        <br />
        <br />

        {/* pain and suffering, generally */}

        <div className="centerdiv">
          <table style={{ width: "50%" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }} className="centerdiv">
                  <table className="center" style={{ margin: "auto" }}>
                    <tbody>
                      <tr>
                        <td></td>
                        <td style={{ backgroundColor: "purple" }}>
                          <img
                            src={`/dice_faces/${faces[0]}.png`}
                            className="fill"
                            alt="1"
                          />
                        </td>
                        <td></td>
                      </tr>

                      <tr>
                        <td style={{ backgroundColor: "green" }}>
                          <img
                            src={`/dice_faces/${faces[2]}.png`}
                            className="fill"
                            alt="3"
                          />
                        </td>

                        <td style={{ backgroundColor: "red" }}>
                          <img
                            src={`/dice_faces/${faces[1]}.png`}
                            className="fill"
                            alt="2"
                          />
                        </td>

                        <td style={{ backgroundColor: "yellow" }}>
                          <img
                            src={`/dice_faces/${faces[3]}.png`}
                            className="fill"
                            alt="4"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td></td>
                        <td style={{ backgroundColor: "orange" }}>
                          <img
                            src={`/dice_faces/${faces[5]}.png`}
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
                            src={`/dice_faces/${faces[4]}.png`}
                            className="fill"
                            alt="5"
                          />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                <td>
                  <div className="scene">
                    <div className="cube center">
                      <div className="cface cf-front">
                        <img
                          src={`/dice_faces/${faces[1]}.png`}
                          className="fill"
                          alt="face 2"
                        />
                      </div>

                      <div className="cface cf-back">
                        <img
                          src={`/dice_faces/${faces[4]}.png`}
                          className="fill"
                          alt="face 5"
                        />
                      </div>

                      <div className="cface cf-right">
                        <img
                          src={`/dice_faces/${faces[3]}.png`}
                          className="fill"
                          alt="face 4"
                        />
                      </div>

                      <div className="cface cf-left">
                        <img
                          src={`/dice_faces/${faces[2]}.png`}
                          className="fill"
                          alt="face 3"
                        />
                      </div>

                      <div className="cface cf-top">
                        <img
                          src={`/dice_faces/${faces[0]}.png`}
                          className="fill"
                          alt="face 1"
                        />
                      </div>

                      <div className="cface cf-bottom">
                        <img
                          src={`/dice_faces/${faces[5]}.png`}
                          className="fill"
                          alt="face 6"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
          <div style = {{ 
            backgroundColor: "rgb(245, 229, 186)",
            minWidth: "100px",
            borderRadius: "10px",
            border: "3px solid tan",
            padding: "3px",
            paddingLeft: "5px",
            paddingRight: "5px"
          }}>
              <b>Current Streak: {streak}</b>
              <br />
              <b>Best Streak: {maxStreak}</b>
          </div>
        </div>
      </main>

      {showEdit && <EditDiePanel
        onClose={() => setShowEdit(false)} 
        faces = {faces}
        setFaces = {setFaces}
      />}

      {showChallenge && <ChallengePanel
        onClose={() => setShowChallenge(false)} 
        faces = {faces}
        challenger = {challenger}
        streak = {streak}
        setStreak = {setStreak}
        maxStreak = {maxStreak}
        setMaxStreak = {setMaxStreak}
      />}


    </div>
  );
}

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

function ChallengePanel({ onClose, faces, challenger, 
  streak, setStreak, 
  maxStreak, setMaxStreak}) {

  const [userRoll, setUserRoll] = useState(null);
  const [enemyRoll, setEnemyRoll] = useState(null);

  function handleChallenge() {
    const userResult = rollDie(faces);
    const enemyResult = rollDie(challenger);

    setUserRoll(userResult);
    setEnemyRoll(enemyResult);

    if (userResult > enemyResult) {
      setStreak(prev => {
        const newStreak = prev + 1;

        setMaxStreak(max => Math.max(max, newStreak));

        return newStreak;
      });
    } 
    else if (userResult < enemyResult) {
      setStreak(0);
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

        {userRoll == null && (
          <div>
          [user]'s die
          <div className = "centerdiv">
            <br />
            <table className="center" style={{ margin: "auto" }}>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ backgroundColor: "purple" }}>
                    <img
                      src={`/dice_faces/${challenger[0]}.png`}
                      className="fill"
                      alt="1"
                    />
                  </td>
                <td></td>
                </tr>

                <tr>
                  <td style={{ backgroundColor: "green" }}>
                    <img
                      src={`/dice_faces/${challenger[2]}.png`}
                      className="fill"
                      alt="3"
                    />
                  </td>

                  <td style={{ backgroundColor: "red" }}>
                    <img
                      src={`/dice_faces/${challenger[1]}.png`}
                      className="fill"
                      alt="2"
                    />
                  </td>

                  <td style={{ backgroundColor: "yellow" }}>
                    <img
                      src={`/dice_faces/${challenger[3]}.png`}
                      className="fill"
                      alt="4"
                    />
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ backgroundColor: "orange" }}>
                    <img
                      src={`/dice_faces/${challenger[5]}.png`}
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
                      src={`/dice_faces/${challenger[4]}.png`}
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
          <div class = "centerdiv">
            <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
              
              <div class = "center">
                <p><b>You <br /> Rolled</b></p>
                <img
                  src={`/dice_faces/${userRoll}.png`}
                  style = {{ width: "100px" }}
                  alt="your roll"
                />
              </div>

              <div class = "center">
                <p><b>[user] <br /> Rolled</b></p>
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
