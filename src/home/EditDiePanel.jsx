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
      setFaces(updatedDie.die);
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