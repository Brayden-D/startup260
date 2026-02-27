import React, { useState } from "react";
import './home.css';

export function Home() {

  const [showEdit, setShowEdit] = useState(false);
  const [faces, setFaces] = useState([1, 2, 3, 4, 5, 6]);

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

      {showEdit && <EditDiePanel
        onClose={() => setShowEdit(false)} 
        faces = {faces}
        setFaces = {setFaces}
      />}



    </div>
  );
}

function EditDiePanel({ onClose, faces, setFaces }) {
  const [draft, setDraft] = useState([...faces]);
  const total = draft.reduce((a, b) => a + b, 0);

  function updateFace(index, value) {
    const newDraft = [...draft];
    newDraft[index] = Number(value) || 0;
    setDraft(newDraft);
  }

  function handleSave() {
    if (total === 21) {
      setFaces(draft);
      onClose();
    }
  }

  return (
    <div className="popup" onClick={onClose}>
      <div
        className="popup-content panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Your Die</h2>

        {draft.map((f, i) => (
          <div key={i}>
            Face {i + 1}:{" "}
            <input
              type="number"
              value={f}
              onChange={(e) => updateFace(i, e.target.value)}
            />
          </div>
        ))}

        <br />
        Total: <b style = {{ color: total === 21 ? "green" : "red" }}>{total}</b>/21
        <br />
        <button disabled={total !== 21} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
