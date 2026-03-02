import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';

export default function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [maxStreak, setMaxStreak] = useState(0);
  

  function handleLogin() {
    if (loggedInUser) {
      setLoggedInUser(null);
      return;
    }
    if (username && password) {
      setLoggedInUser(username);
      setPassword("");
    }
  }

  return (
    <BrowserRouter>
    <div className="background" style={{ backgroundImage: "url('/felt.png')" }}>
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
              {!loggedInUser && (
                <span>
                <span className="nowrap"
                  style = {{ marginRight: "10px"}}>
                  Username: 
                  <input type="text" 
                    placeholder="username" 
                    value = {username}
                    onChange={(e) => setUsername(e.target.value)}
                    style = {{ marginLeft: "5px"}}
                  />
                </span>

                <span className="nowrap"
                  style = {{ marginRight: "10px"}}>
                  Password:
                  <input type="text" 
                    placeholder="username" 
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    style = {{ marginLeft: "5px"}}
                  />
                </span>
                </span> 
              )}

              <span className="nowrap">
                <button type="submit" 
                onClick={handleLogin}>
                  {loggedInUser ? "Logout" : "Login"}
                </button>
                {!loggedInUser && (
                  <button type="submit" 
                    onClick={handleLogin}
                    style = {{ marginLeft: "5px"}}>
                    Create
                  </button>
                )}
              </span>

              <div style={{ height: "5px" }}></div>
              {loggedInUser
                ? `Logged in as ${loggedInUser}`
                : "Not logged in"}
            </td>
          </tr>
        </table>
      </header>

      <Routes>
        <Route path='/' element={<Home 
            maxStreak={maxStreak} setMaxStreak={setMaxStreak} />} exact />
        <Route path='/leaderboard' element={<Leaderboard 
            loggedInUser = {loggedInUser} maxStreak={maxStreak} />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

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
              <NavLink to="">
                <span className="linkbutton">Home</span>
              </NavLink>
              &nbsp;
              <NavLink to="leaderboard">
                <span className="linkbutton">Leaderboard</span>
              </NavLink>
              &nbsp;
              <NavLink to="about">
                <span className="linkbutton">About</span>
              </NavLink>
              &nbsp;&nbsp;&nbsp;
            </td>
          </tr>
        </table>
      </footer>
    </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}