import React, { useState, useEffect } from "react";
import './home.css';
import { EditDiePanel } from "./EditDiePanel";
import { ChallengePanel } from "./ChallengePanel";
import { generatePath } from "react-router-dom";
import { GameEvent, GameNotifier } from "./gameNotifier";

export function Home({ loggedInUser }) {

  const [showEdit, setShowEdit] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [faces, setFaces] = useState([1, 2, 3, 4, 5, 6]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!loggedInUser) return;

    async function loadUserData() {
      try {
        const [scoreRes, dieRes] = await Promise.all([
          fetch("/api/score", {
            method: "GET",
            credentials: "include"
          }),
          fetch("/api/die", {
            method: "GET",
            credentials: "include"
          })
        ]);

        if (scoreRes.ok) {
          const score = await scoreRes.json();
          setStreak(score);
          setMaxStreak(score);
        }

        if (dieRes.ok) {
          const data = await dieRes.json();
          if (data?.die) {
            setFaces(data.die);
          }
        }

      } catch (err) {
        console.error("Failed to load user data", err);
      }
    }

    loadUserData();

  }, [loggedInUser]);

  const addNotification = (text) => {
    setNotifications((prev) => {
      const updated = [...prev, { id: Date.now(), text }];
      return updated.slice(-10);
    });
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== id)
    );
  };

  useEffect(() => {
      function handleGameEvent(event) {
        if (event.from === loggedInUser) return;
        let message = "";

        if (event.type === GameEvent.Streak) {
          message = `${event.from} is on a streak of ${event.value.streak}!`;
        } 
        else if (event.type === GameEvent.DieNotif) {
          if (event.value.defender == loggedInUser) {
            // gamestatus is either won, lost, or tied
              message = `Your dice ${event.value.gameStatus} against ${event.from}!`;
          }
        } 
        else if (event.type === GameEvent.System) {
          message = event.value.msg;
        }

        if (message) {
          addNotification(message);
        }
      }

      GameNotifier.addHandler(handleGameEvent);

      return () => {
        GameNotifier.removeHandler(handleGameEvent);
      };
    }, [loggedInUser]);

  return (
    <div className="app-container">
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
        loggedInUser = {loggedInUser}
        streak = {streak}
        setStreak = {setStreak}
        maxStreak = {maxStreak}
        setMaxStreak = {setMaxStreak}
      />}


    </div>
  );
}


