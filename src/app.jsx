import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export default function App() {
  return (
    <div className="background">
      <header className="header">
        <table style={{ width: "100%" }}>
          <tr>
            <td>
              <h1
                style={{ paddingLeft: "20px", paddingTop: "7px" }}
                className="nowrap"
              >
                Weighted Dice
              </h1>
            </td>
            <td style={{ textAlign: "right", paddingRight: "10px" }}>
              <span className="nowrap">
                Username:
                <input type="text" placeholder="username" />
              </span>

              &nbsp;&nbsp;

              <span className="nowrap">
                Password:
                <input type="password" placeholder="password" />
              </span>

              <span className="nowrap">
                <button type="submit" className="smallbutton">
                  Login
                </button>
                <button type="submit" className="smallbutton">
                  Create
                </button>
              </span>

              <div style={{ height: "5px" }}></div>
              Logged in as [placeholder]
            </td>
          </tr>
        </table>
      </header>

      <footer className="footer">
        <table style={{ width: "100%" }}>
          <tr>
            <td style={{ width: "50%" }}>
              Author(s): Brayden Dickerson
              <br />
              <img
                src="github.png"
                style={{ height: "15px" }}
                alt="github"
              />
              <span className="linkbutton">
                <a href="https://github.com/Brayden-D/startup260/tree/main">
                  Github
                </a>
              </span>
            </td>
            <td style={{ textAlign: "right", width: "50%" }}>
              <a href="index.html">
                <span className="linkbutton">Home</span>
              </a>
              &nbsp;
              <a href="leaderboard.html">
                <span className="linkbutton">Leaderboard</span>
              </a>
              &nbsp;
              <a href="about.html">
                <span className="linkbutton">About</span>
              </a>
              &nbsp;&nbsp;&nbsp;
            </td>
          </tr>
        </table>
      </footer>
    </div>
  );
}
