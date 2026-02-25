import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';

export default function App() {
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

      <Routes>
        <Route path='/' element={<Home />} exact />
        <Route path='/leaderboard' element={<Leaderboard />} />
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