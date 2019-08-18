import React, { useState, useEffect } from "react";
import "./App.css";
import suspense from "./music.mp3";
import gameovermusic from "./gameover.mp3";
import refresh from "./refresh.svg";
import volumeOn from "./volume-on.svg";
import volumeOff from "./volume-off.svg";
import { Board } from "./Components";
import { calculateWinner } from "./utils";
const audioSources = {
  suspense: suspense,
  gameovermusic: gameovermusic
};

function App() {
  // Which screen to show
  const [isWelcome, setIsWelcome] = useState(true);
  const startGame = () => setIsWelcome(false);
  const exitGame = () => setIsWelcome(true);

  // Show install button
  let deferredInstallPrompt;
  async function promptInstallApp(e) {
    e.preventDefault();
    deferredInstallPrompt = e;

    if (
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    )
      return false;

    // Prompt
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    e.srcElement.setAttribute("hidden", true);
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === "accepted") console.log("App installed");
    else console.log("App not installed");

    deferredInstallPrompt = e;
  }
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", promptInstallApp);
    return () =>
      window.removeEventListener("beforeinstallprompt", promptInstallApp);
  });

  // Render
  if (isWelcome) return <WelcomeScreen onStartGame={startGame} />;
  return <Game onExitGame={exitGame} />;
}

export default App;

function WelcomeScreen({ onStartGame }) {
  return (
    <div className="App">
      <h1 className="GameLogo">
        <span className="Tic">Tic</span>
        <span className="Tac">Tac</span>
        <span className="Toe">Toe</span>
      </h1>
      <div className="PlayButton" onClick={onStartGame}>
        PLAY
      </div>
    </div>
  );
}

function Game({ onExitGame }) {
  const initialSquares = Array(9).fill(null);
  const [squares, setSquares] = useState(initialSquares);
  const [xIsNext, setXIsNext] = useState(true);
  const [audioSource, setAudioSource] = useState(audioSources.suspense);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  function endGame() {
    setIsGameEnded(true);
    setAudioSource(audioSources.gameovermusic);
  }
  function startGame() {
    setIsGameEnded(false);
    setAudioSource(audioSources.suspense);
    setSquares(initialSquares);
    setXIsNext(true);
  }

  const toggleMusic = () => setIsMusicPlaying(!isMusicPlaying);
  useEffect(() => {
    if (
      calculateWinner(squares) ||
      squares.filter(v => v !== null).length === 9
    )
      return endGame();
  }, [squares]);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const newState = [...squares];
    newState[i] = xIsNext ? "X" : "O";

    setSquares(newState);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="App">
      <header className="Header">
        <div className="Exit" onClick={onExitGame}>
          EXIT
        </div>

        <div className="Controls">
          <div className="ControlsIcon Refresh" onClick={startGame}>
            <img src={refresh} alt="" className="ControlsImage RefreshImage" />
          </div>
          <div className="ControlsIcon Volume" onClick={toggleMusic}>
            <img
              src={isMusicPlaying ? volumeOn : volumeOff}
              alt=""
              className="ControlsImage"
            />
          </div>
        </div>
      </header>
      <h1>
        {calculateWinner(squares)
          ? `Player ${calculateWinner(squares)} won!`
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </h1>
      <Board squares={squares} onClick={i => handleClick(i)} />
      <div
        className="GameEnd"
        style={{ visibility: isGameEnded ? "visible" : "hidden" }}
      >
        <div className="game-over">
          Game Over!
          <span role="img" aria-label="smile">
            😊
          </span>
        </div>
        <div className="PlayAgain" onClick={startGame}>
          Play Again
        </div>
      </div>
      {isMusicPlaying && (
        <audio src={audioSource} autoPlay loop controls={false} />
      )}
    </div>
  );
}
