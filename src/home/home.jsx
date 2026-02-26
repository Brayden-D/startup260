import React, { useState } from "react";
import './home.css';

export function Home() {

  const [showEdit, setShowEdit] = useState(false);

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

        <div style={{ height: "10px" }}></div>
        <div className="notification">Placeholder notif 1</div>

        <div style={{ height: "10px" }}></div>
        <div className="notification">Placeholder notif 2</div>

        <div style={{ height: "10px" }}></div>
        <div className="notification">wow look at this websocket</div>
      </aside>

      <main>
        <br />

        <div className="center">
          <button className="bigbutton" onClick={() => setShowEdit(true)}>
            <b>Edit Die</b>
          </button>

          &nbsp;&nbsp;&nbsp;

          <button className="bigbutton">
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
                            src="/dice_faces/1.png"
                            className="fill"
                            alt="1"
                          />
                        </td>
                        <td></td>
                      </tr>

                      <tr>
                        <td style={{ backgroundColor: "green" }}>
                          <img
                            src="/dice_faces/3.png"
                            className="fill"
                            alt="3"
                          />
                        </td>

                        <td style={{ backgroundColor: "red" }}>
                          <img
                            src="/dice_faces/2.png"
                            className="fill"
                            alt="2"
                          />
                        </td>

                        <td style={{ backgroundColor: "yellow" }}>
                          <img
                            src="/dice_faces/4.png"
                            className="fill"
                            alt="4"
                          />
                        </td>
                      </tr>

                      <tr>
                        <td></td>
                        <td style={{ backgroundColor: "orange" }}>
                          <img
                            src="/dice_faces/6.png"
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
                            src="/dice_faces/5.png"
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
                          src="/dice_faces/2.png"
                          className="fill"
                          alt="2"
                        />
                      </div>

                      <div className="cface cf-back">
                        <img
                          src="/dice_faces/5.png"
                          className="fill"
                          alt="5"
                        />
                      </div>

                      <div className="cface cf-right">
                        <img
                          src="/dice_faces/4.png"
                          className="fill"
                          alt="4"
                        />
                      </div>

                      <div className="cface cf-left">
                        <img
                          src="/dice_faces/3.png"
                          className="fill"
                          alt="3"
                        />
                      </div>

                      <div className="cface cf-top">
                        <img
                          src="/dice_faces/1.png"
                          className="fill"
                          alt="1"
                        />
                      </div>

                      <div className="cface cf-bottom">
                        <img
                          src="/dice_faces/6.png"
                          className="fill"
                          alt="6"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {showEdit && <EditDieModal onClose={() => setShowEdit(false)} />}

    </div>
  );
}

function EditDieModal({ onClose }) {
  return (
    <div className="popup" onClick={onClose}>
      <div
        className="popup-content panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Your Die</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}