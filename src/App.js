import React, { useState } from "react";
import "./App.css";
import music from "./music.mp3";
import { Board } from "./Components";

function App() {
  const initialSquares = Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  // const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const newState = [...squares];
    newState[i] = xIsNext ? "X" : "O";

    setSquares(newState);
    // setStep(step + 1);
    setXIsNext(!xIsNext);
  }

  function handlePlayAgain() {
    setSquares(initialSquares);
    setXIsNext(true);
  }

  function isGameEnded() {
    return (
      calculateWinner(squares) || squares.filter(v => v !== null).length === 9
    );
  }
  return (
    <div className="App">
      <div className="topright">
        <ion-icon name="volume-high" />
        <div className="Refresh" onClick={handlePlayAgain}>
          <ion-icon name="refresh" />
        </div>
      </div>
      <h1>
        {calculateWinner(squares)
          ? `Player ${calculateWinner(squares)} won!`
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </h1>
      <Board squares={squares} onClick={i => handleClick(i)} />
      <div
        className="GameEnd"
        style={{ visibility: isGameEnded() ? "visible" : "hidden" }}
      >
        <div className="game-over">
          Game Over! <span role="img" aria-label="a">😊</span>
        </div>
        <div className="PlayAgain" onClick={handlePlayAgain}>Play Again</div>
      </div>
      <audio src={music} autoPlay></audio>
    </div>
  );
}

export default App;

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

