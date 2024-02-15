import { useState } from "react";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinner, checkEndGame } from "./logic/board";
import { Winner } from "./components/Winner";
import { saveGameStorage, resetGameStorage } from "./logic/storage/index.js";

function App() {
  //ESTADO INICIAL
  const [board, setBoard] = useState(() => {
    //leer el localStorage cuando se realice un movimiento
    const boardFromStorage = window.localStorage.getItem("board");
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null);
  });

  //PRIMER TURNO X
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  //Winner state
  const [winner, setWinner] = useState(null);

  //RESET GAME
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
  };

  //NUEVO TURNO
  const updateBoard = (index) => {
    //NO ACTUALIZA ESTADO SI YA TIENE ALGO
    if (board[index] || winner) return;

    // ACTUALIZA EL TABLERO
    const newBoard = [...board];
    // PASAR ESTADO NUEVO
    newBoard[index] = turn;
    setBoard(newBoard);
    //CAMBIA TURNO
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardado
    saveGameStorage({ board: newBoard, turn: newTurn });
    //CHECK DE GANADOR
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };
  return (
    <main className="board">
      <h1>3 en linea</h1>
      <button onClick={resetGame}> Reset del Juego </button>
      <section className="game">
        {board.map((square, index) => {
          return (
            //UPDATE NO SE PASA COMO FUNCION SINO COMO PARAMETRO
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <Winner resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
