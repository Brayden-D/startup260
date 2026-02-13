import React from "react";

export function About() {
  return (
    <main>
      <br />
      <br />

      <div className="centerdiv">
        <div
          className="centerdiv panel"
          style={{ width: "50%" }}
        >
          <div>
            <h1>About</h1>
          </div>

          <div
            style={{
              textAlign: "left",
              width: "85%",
            }}
          >
            Weighted dice is a website that lets you make a custom die and roll
            it against other users' dice. Every die will have 21 dots (called
            pips) total, but you choose how many each face has.
            <br />
            <br />
            Click on Edit Die to customize your die, and click challenge to
            roll against another random user's die!
            <br />
            <br />
            This is based on a cool concept known as{" "}
            <a
              href="https://en.wikipedia.org/wiki/Intransitive_dice"
              target="_blank"
              rel="noopener noreferrer"
            >
              Intransitive Dice
            </a>
            . Essentially, there is no optimal way to arrange the pips. Every
            distribution has strengths and weaknesses. Try to change your die
            to be favored against your opponents!
          </div>

          <br />

          <div className="center">
            <img
              src="/dice.png"
              style={{
                width: "20%",
                transform: "rotate(45deg)",
              }}
              alt="dice"
            />
            <br />
            <br />
          </div>
        </div>
      </div>
    </main>
  );
}
