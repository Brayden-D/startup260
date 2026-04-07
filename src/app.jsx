import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';

export default function App() {

  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [password, setPassword] = useState(""); 
  
  useEffect(() => {
    fetch("/api/score", { method: "GET", credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) setLoggedInUser(data.username);
      })
      .catch(() => setLoggedInUser(null));
  }, []);

  async function handleLogin(isCreate = false) {
    if (loggedInUser) {
      await fetch("/api/auth/logout", { method: "DELETE", credentials: "include" });
      setLoggedInUser(null);
      return;
    }
    if (!username || !password) return;

    const endpoint = isCreate ? "/api/auth/create" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      console.log("status:", res.status);

      if (!res.ok) {
        const data = await res.json();
        alert(data.msg || "Login failed");
        return;
      }

      const data = await res.json();
      setLoggedInUser(data.username);
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Login request failed");
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
                  <input type="password" 
                    placeholder="password" 
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    style = {{ marginLeft: "5px"}}
                  />
                </span>
                </span> 
              )}

              <span className="nowrap">
                <button type="submit" 
                onClick={() => handleLogin(false)}>
                  {loggedInUser ? "Logout" : "Login"}
                </button>
                {!loggedInUser && (
                  <button type="submit" 
                    onClick={() => handleLogin(true)}
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

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path='/' element={<Home  loggedInUser = {loggedInUser}/>} exact />
          <Route path='/leaderboard' element={<Leaderboard 
              loggedInUser = {loggedInUser} />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

      <br />
      <br />

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