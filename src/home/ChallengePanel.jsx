import React, { useState, useEffect } from "react";
import { GameNotifier, GameEvent } from "./gameNotifier";

export function ChallengePanel({
  onClose,
  faces,
  loggedInUser,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  challenger,
  setChallenger
}) {
  const [userRoll, setUserRoll] = useState(null);
  const [enemyRoll, setEnemyRoll] = useState(null);
  const placeholderDie = [0,0,0,0,0,0]
  const displayDie = challenger.die || placeholderDie;
  const odds = calculateOdds(faces, displayDie);

  async function fetchNewChallenger(currentChallengerId) {
    try {
      let newChallenger = null;

      do {
        const res = await fetch("/api/dice", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        newChallenger = data;
      } while (currentChallengerId && newChallenger.id === currentChallengerId);

      setChallenger(newChallenger);
    } catch (err) {
      console.error(err);
    }
  }

  function rollDie(die) {
    const index = Math.floor(Math.random() * 6);
    return die[index];
  }

  function calculateOdds(userDie, enemyDie) {
    let win = 0;
    let tie = 0;
    let loss = 0;

    for (let u of userDie) {
      for (let e of enemyDie) {
        if (u > e) win++;
        else if (u === e) tie++;
        else loss++;
      }
    }

    const total = userDie.length * enemyDie.length;

    return {
      win: ((win / total) * 100).toFixed(1),
      tie: ((tie / total) * 100).toFixed(1),
      loss: ((loss / total) * 100).toFixed(1),
    };
  }

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
        GameNotifier.broadcastEvent(loggedInUser, GameEvent.Streak, { streak: newStreak });
      }
    } else if (userResult < enemyResult) {
      newStreak = 0;
      setStreak(0);
    }

    if (newStreak > maxStreak) {
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
  }

  return (
    <div className="popup" onClick={onClose}>
      <div className="popup-content panel" onClick={(e) => e.stopPropagation()}>
        <h2>Challenge</h2>

        {userRoll == null && (
          <div>
            {challenger.username}'s die
            <div className="centerdiv">
              <br />
              <table className="center" style={{ margin: "auto", width: "90%" }}>
                <tbody>
                  <tr>
                    <td></td>
                    <td style={{ backgroundColor: "purple" }}>
                      <img src={`/dice_faces/${displayDie[0]}.png`} className="fill" alt="1" />
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td style={{ backgroundColor: "green" }}>
                      <img src={`/dice_faces/${displayDie[2]}.png`} className="fill" alt="3" />
                    </td>
                    <td style={{ backgroundColor: "red" }}>
                      <img src={`/dice_faces/${displayDie[1]}.png`} className="fill" alt="2" />
                    </td>
                    <td style={{ backgroundColor: "yellow" }}>
                      <img src={`/dice_faces/${displayDie[3]}.png`} className="fill" alt="4" />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ backgroundColor: "orange" }}>
                      <img src={`/dice_faces/${displayDie[5]}.png`} className="fill" alt="6" />
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td style={{ backgroundColor: "blue" }}>
                      <img src={`/dice_faces/${displayDie[4]}.png`} className="fill" alt="5" />
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {userRoll !== null && (
          <div className="centerdiv">
            <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
              <div className="center">
                <p><b>You <br /> Rolled</b></p>
                <img src={`/dice_faces/${userRoll}.png`} style={{ width: "100px" }} alt="your roll" />
              </div>

              <div className="center">
                <p><b>{challenger.username} <br /> Rolled</b></p>
                <img src={`/dice_faces/${enemyRoll}.png`} style={{ width: "100px" }} alt="enemy roll" />
              </div>
            </div>

            <h2 style={{
              marginTop: "20px",
              color: userRoll > enemyRoll ? "green" : userRoll < enemyRoll ? "red" : "gray"
            }}>
              {userRoll > enemyRoll ? "You Win!" : userRoll < enemyRoll ? "You Lose!" : "Tie!"}
            </h2>
          </div>
        )}

        {userRoll == null &&
        <div>
          <br />
          <span>Odds: </span>
          <span style = {{color: "green", marginRight: "10px"}}>
            {odds.win}%
          </span>
          <span style = {{color: "gray", marginRight: "10px"}}>
            {odds.tie}%
          </span>
          <span style = {{color: "red", marginRight: "10px"}}>
            {odds.loss}%
          </span>
          <br />
        </div>}

        <br />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose}>Close</button>
          {userRoll == null && !displayDie.every(val => val === 0) && 
            <>
            <button onClick={fetchNewChallenger}>New Opponent</button>
            <button onClick={handleChallenge}>Challenge</button>
            </>
          }
        </div>
      </div>
    </div>
  );
}